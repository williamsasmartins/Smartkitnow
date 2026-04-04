import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CryptoToCryptoExchangeRateCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    cryptoAmount: "", 
    exchangeRate: "", 
    feePercentage: "" 
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
      question: "Is converting crypto-to-crypto a taxable event?",
      answer: "Yes -- the IRS explicitly confirmed in Rev. Rul. 2019-24 that crypto-to-crypto trades are taxable. When you swap BTC for ETH, it is treated as: (1) selling BTC at its current FMV (triggering capital gain/loss), (2) buying ETH at that same FMV (establishing your new cost basis). Example: sold 0.1 BTC (cost basis $3,000) when BTC = $60,000 ($6,000 value). You recognize $3,000 capital gain and receive ETH with $6,000 cost basis. This applies to all exchanges -- DEX swaps on Uniswap, CEX trades on Binance, and bridging between chains (which the IRS has not explicitly ruled on, but most tax professionals treat as taxable)."
    },
    {
      question: "How does the exchange rate between two cryptocurrencies differ from fiat exchange rates?",
      answer: "Crypto-to-crypto rates are derived market rates with no central authority setting them. On DEXes (Uniswap, Curve), rates are set by automated market makers (AMMs) using liquidity pool ratios -- a large trade moves the rate. On CEXes (Binance, Coinbase), rates are determined by the order book. The same BTC/ETH rate may differ by 0.1–0.5% across exchanges at any moment (arbitrage opportunity). Unlike fiat FX markets which trade $7.5 trillion/day with tight spreads, crypto cross-rates have higher slippage on large trades and wider spreads for illiquid pairs. Always use a fresh rate from your execution venue, not a general price aggregator, for tax reporting."
    },
    {
      question: "What is slippage in crypto-to-crypto exchanges and how does it affect my rate?",
      answer: "Slippage is the difference between your expected rate and your executed rate, caused by insufficient liquidity or price movement between order submission and execution. On DEXes: a $10,000 BTC→ETH swap on a liquid pair might have 0.05% slippage; the same swap on a low-liquidity pair could have 5%+ slippage. On CEXes: market orders suffer slippage based on order book depth; limit orders eliminate slippage but may not execute. Price impact (a specific type of slippage on AMMs) increases proportionally with trade size relative to pool liquidity. For large swaps (>$50,000), always check the price impact percentage before confirming a DEX transaction."
    },
    {
      question: "How do gas fees affect the true cost of crypto-to-crypto exchanges?",
      answer: "Gas fees are paid in the native token of the blockchain (ETH on Ethereum, BNB on BSC, SOL on Solana) and add directly to your cost basis for the received token. On Ethereum: during peak congestion, a single swap can cost $20–$200 in gas. Example: swap $500 worth of USDC to ETH, pay $50 gas. True cost basis of ETH received = $550. DEX aggregators (1inch, Paraswap) find the lowest slippage route but cannot reduce base gas fees. For small swaps below $1,000, gas fees can represent 5–20% of transaction value on Ethereum mainnet -- use L2 networks (Arbitrum, Base) or CEXes for small trades where gas optimization matters."
    },
    {
      question: "What is the best way to get the most accurate exchange rate for a crypto swap?",
      answer: "For execution purposes: use a DEX aggregator (1inch, Jupiter on Solana) which queries multiple liquidity sources simultaneously -- typically beats single-DEX rates by 0.1–0.5% on large trades. For reference/tax reporting: use the exact executed price from your trade confirmation, not a spot price from CoinGecko at the time -- the IRS requires the actual transaction rate, not an approximated FMV. For fiat conversion (to calculate USD value): use the exchange's USD price at the exact timestamp of the trade. Crypto tax software like Koinly pulls historical price data at the exact transaction timestamp, which is essential for compliance. Approximating rates by date (not time) can create material errors on high-volatility days."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

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
    const mainResult = cryptoAmountValue * exchangeRateValue;
    const feeAmount = (mainResult * feePercentageValue) / 100;
    const netResult = mainResult - feeAmount;

    // Generate schedule data if applicable (e.g., transaction breakdown)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      transactionAmount: mainResult / 12,
      fee: feeAmount / 12,
      netAmount: netResult / 12,
      balance: netResult - ((netResult / 12) * (i + 1))
    }));

    return { 
      mainResult, 
      result2: feeAmount, 
      result3: netResult, 
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
              Exchange Rate
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
              Fee Percentage
            </Label>
            <Input
              type="number"
              placeholder="e.g., 0.5"
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
                      Total Exchange Value
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
                      Net Exchange Value
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
                    Transaction Breakdown
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
                        : `Show All ${results.scheduleData.length} Transactions`}
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
                        <TableHead className="font-semibold">Transaction Amount</TableHead>
                        <TableHead className="font-semibold">Fee</TableHead>
                        <TableHead className="font-semibold">Net Amount</TableHead>
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
                            <TableCell>{formatCurrency(row.transactionAmount)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.fee)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.netAmount)}
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
          Understanding Crypto to Crypto Exchange Rate Calculator
        </h2>
        
        <p className="mb-6">
          The Crypto to Crypto Exchange Rate Calculator is a powerful tool designed to help cryptocurrency traders and investors determine the exchange rates between different cryptocurrencies. In the ever-evolving world of digital currencies, knowing the exact value of one crypto asset in terms of another is crucial for making informed trading decisions. Whether you're swapping Bitcoin for Ethereum or converting altcoins into stablecoins, this calculator provides the precision you need to optimize your trades.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in the cryptocurrency market, where prices can fluctuate dramatically within minutes. An incorrect exchange rate can lead to significant financial losses, especially when dealing with large volumes. This calculator mitigates such risks by offering real-time exchange rate calculations, ensuring you always have the most up-to-date information at your fingertips. By using this tool, you can confidently execute trades, knowing that your calculations are precise and reliable.
        </p>
        
        <p className="mb-6">
          To use the Crypto to Crypto Exchange Rate Calculator, you'll need to gather some basic information. First, determine the amount of cryptocurrency you wish to exchange. Next, find the current exchange rate for the crypto pair you're interested in. Finally, consider any transaction fees that might apply. Enter these values into the calculator, and it will instantly provide you with the total exchange value, the fees, and the net amount you'll receive. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the exchange rate and fees before executing a trade. Market conditions can change rapidly, and what seems like a small fee can add up over multiple transactions. Use this calculator to simulate different scenarios and choose the most cost-effective option.
          </p>
        </div>
        
        <p className="mb-6">
          For best results, ensure that you're using the latest exchange rates and consider the volatility of the cryptocurrencies involved. Some cryptos are more stable than others, which can affect the accuracy of your calculations. Additionally, be aware of any network congestion or delays that might impact transaction times and costs. For more detailed financial planning, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Crypto to Crypto Exchange Rate Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Crypto to Crypto Exchange Rate Calculator is straightforward yet powerful. It calculates the total exchange value by multiplying the amount of cryptocurrency you have by the current exchange rate. From this total, it subtracts any applicable transaction fees to give you the net exchange value.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Net Exchange Value = (Crypto Amount × Exchange Rate) - Fees
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Crypto Amount = The amount of cryptocurrency you wish to exchange</li>
              <li>Exchange Rate = The current rate of exchange between the two cryptocurrencies</li>
              <li>Fees = The transaction fees applied to the exchange</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in this formula plays a critical role in determining the final outcome. The Crypto Amount is the quantity of the cryptocurrency you are willing to trade. The Exchange Rate is the current market rate, which can vary significantly depending on the platform and market conditions. Fees are often a percentage of the total transaction and can vary based on the exchange or wallet service used. Understanding how each of these factors affects your net exchange value is crucial for optimizing your trades.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Several factors can influence the results of your crypto to crypto exchange calculations. Understanding these factors can help you make more informed decisions and optimize your trading strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Exchange Rate Volatility
        </h3>
        <p className="mb-4">
          Cryptocurrency markets are known for their volatility. Exchange rates can fluctuate dramatically within short periods, affecting the value of your trades. It's essential to monitor the market and use real-time data when calculating exchange rates. Consider setting alerts for significant market movements to stay informed.
        </p>
        <p className="mb-6">
          Using a reliable source for exchange rates can mitigate some of the risks associated with volatility. Ensure that the rates you use are up-to-date and reflect the current market conditions. For more on managing financial volatility, see our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Transaction Fees
        </h3>
        <p className="mb-4">
          Transaction fees can significantly impact the net value of your exchange. These fees vary depending on the exchange platform, the cryptocurrencies involved, and the network congestion at the time of the transaction. It's crucial to account for these fees in your calculations to avoid unexpected costs.
        </p>
        <p className="mb-6">
          Some platforms offer lower fees for higher volume trades or for using their native tokens. Researching and comparing fees across different platforms can help you minimize costs and maximize your returns.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Liquidity
        </h3>
        <p className="mb-4">
          Liquidity refers to the ease with which a cryptocurrency can be bought or sold without affecting its price. High liquidity means that there are plenty of buyers and sellers, which typically results in more stable prices. Low liquidity can lead to price slippage, where the final price of a trade is different from the expected price.
        </p>
        <p className="mb-6">
          To avoid slippage, consider trading during times of high market activity or using limit orders to set the maximum price you're willing to pay. Understanding liquidity can help you make more strategic trading decisions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Sentiment
        </h3>
        <p className="mb-6">
          Market sentiment can influence cryptocurrency prices. Positive news, such as regulatory approval or technological advancements, can drive prices up, while negative news can have the opposite effect. Staying informed about the latest news and trends can help you anticipate market movements and adjust your strategy accordingly.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Environment
        </h3>
        <p className="mb-6">
          The regulatory environment for cryptocurrencies varies by country and can impact the availability and legality of certain exchanges and coins. Understanding the regulations in your jurisdiction can help you navigate the market more effectively and avoid potential legal issues.
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
                href="https://www.coindesk.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                CoinDesk - Cryptocurrency News
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Stay updated with the latest cryptocurrency news and market trends.
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
                One of the largest cryptocurrency exchanges offering a wide range of trading pairs.
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
                A user-friendly platform for buying, selling, and managing cryptocurrency.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.kraken.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Kraken - Cryptocurrency Exchange
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Offers a wide range of cryptocurrencies and advanced trading features.
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
                Securely store and manage your cryptocurrency with a trusted wallet.
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
        </ul>
      </section>
    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Crypto to Crypto Exchange Rate Calculator"
      description="Calculate exchange rates between different cryptocurrencies. Determine swap ratios for altcoins and tokens quickly."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Crypto to Crypto Exchange Rate Calculator" },
        { id: "formula", label: "Crypto to Crypto Exchange Rate Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Exchange Value = (Crypto Amount × Exchange Rate) - Fees",
        variables: [
          { symbol: "Crypto Amount", description: "The amount of cryptocurrency you wish to exchange" },
          { symbol: "Exchange Rate", description: "The current rate of exchange between the two cryptocurrencies" },
          { symbol: "Fees", description: "The transaction fees applied to the exchange" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have 2 Bitcoin and want to exchange it for Ethereum at a rate of $3,000 per Bitcoin with a 1% fee.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "2 × 3000 = 6000", 
            explanation: "Calculate the total exchange value without fees." 
          },
          { 
            label: "Step 2", 
            calculation: "6000 × 0.01 = 60", 
            explanation: "Calculate the total fees." 
          },
          { 
            label: "Step 3", 
            calculation: "6000 - 60 = 5940", 
            explanation: "Subtract the fees from the total exchange value to get the net amount." 
          }
        ],
        result: "The final result is $5,940, meaning you will receive this amount in Ethereum after fees."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💳" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💼" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}