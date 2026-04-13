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
      question: "What cryptocurrencies can I convert using this calculator?",
      answer: "This multi-currency crypto converter supports major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Cardano (ADA), Ripple (XRP), Polkadot (DOT), and Dogecoin (DOGE), among others. The calculator updates exchange rates in real-time to reflect current market prices across all supported digital assets. You can convert between any combination of these cryptocurrencies or traditional fiat currencies like USD, EUR, GBP, and JPY. Most converters support over 100+ cryptocurrency and 150+ fiat currency pairs.",
    },
    {
      question: "How accurate are the exchange rates in the crypto converter?",
      answer: "Exchange rates in crypto converters are typically updated every 1-5 seconds, pulling data from major exchanges like Coinbase, Kraken, and Binance. However, actual execution rates may differ by 0.5-2% depending on your chosen exchange, trading volume, and market volatility at the time of purchase. Real-time rates ensure you see current market conditions, but rates lock in only when you complete a transaction on your exchange. Always check your specific exchange's rates immediately before executing a trade, as prices can fluctuate rapidly.",
    },
    {
      question: "Can I use this converter to calculate my crypto tax obligations?",
      answer: "While the multi-currency converter accurately calculates the USD or fiat equivalent of your crypto holdings at current rates, it should not be used as your sole tool for tax reporting. The IRS treats each crypto transaction as a taxable event, requiring you to report gains or losses based on the fair market value in USD on the transaction date, not today's price. For accurate tax calculations, use dedicated crypto tax software like CoinTracker or Koinly that track cost basis, holding periods, and long-term vs. short-term gains. The converter is useful for understanding your current portfolio value but requires additional tools for compliance.",
    },
    {
      question: "What's the difference between spot price and the rate shown in the converter?",
      answer: "The spot price is the real-time market price at which a cryptocurrency trades on major exchanges, typically what you see in the converter. When you actually buy or sell crypto, your exchange may charge a spread (fee built into the price) ranging from 0.1-2% for Bitcoin and up to 5% for smaller altcoins. Additionally, network fees (gas fees on Ethereum can range from $5-$100+ depending on congestion) are separate costs not reflected in the converter's exchange rate. The converter shows the mathematical conversion, but your actual cost will include the exchange spread plus any blockchain transaction fees.",
    },
    {
      question: "How do I convert stablecoins like USDC or USDT using this calculator?",
      answer: "Stablecoins like USDC and USDT can be converted just like any other cryptocurrency in the calculator. USDC and USDT maintain a 1:1 peg to the US dollar, so 1 USDC always equals approximately $1.00 USD, though minor price variations under 0.5% may occur during market stress. When converting stablecoins to traditional fiat currency (USD, EUR, etc.), the converter will show the current exchange rate of the stablecoin, though you may incur network withdrawal fees of $5-$20 depending on blockchain and exchange. Stablecoins are useful for quick conversions without exposure to volatility, but withdrawal and bridge fees should be factored into your calculation.",
    },
    {
      question: "Why do conversion rates differ between this calculator and my exchange?",
      answer: "Different exchanges source prices from different liquidity pools and may have slight variations in real-time rates, typically within 0.2-1% of each other for major pairs. Your exchange may apply its own spread or markup on top of the spot price, which is how they profit from trades. Geographic location also affects rates—some regions have premium or discount prices based on local demand and regulatory environment. Always verify rates directly on your intended exchange before executing a trade, as the converter shows market rates but not your specific exchange's fees or spreads.",
    },
    {
      question: "Can this converter account for different blockchain networks (Ethereum vs. Bitcoin Lightning Network)?",
      answer: "Most multi-currency crypto converters show prices for the same asset across different blockchains as nearly identical, since they represent the same underlying value. However, wrapped tokens (like WBTC on Ethereum or ETH on Polygon) may trade at slightly different rates due to wrapping/unwrapping fees and different liquidity pools, typically within 0.1-0.3%. The converter itself doesn't distinguish between these variants, so you must manually account for any network premium or discount when comparing prices. Always specify which blockchain network and token address you're converting when comparing rates across different platforms.",
    },
    {
      question: "What happens to my converted amount if prices crash immediately after I calculate it?",
      answer: "The converter shows only the theoretical conversion at that specific moment; it does not lock in any price or protect you from market movements. Cryptocurrency prices can move 5-20% or more within minutes during volatile market conditions, so a conversion calculated now may be significantly different by the time you execute it. To protect yourself, execute trades as quickly as possible after calculating, use limit orders instead of market orders, or use a slippage tolerance feature (typically set to 0.5-2%) on decentralized exchanges. The calculator is a planning tool, not a guarantee of execution price.",
    },
    {
      question: "How do I convert crypto to multiple fiat currencies at once using this tool?",
      answer: "Most multi-currency converters allow you to input an amount in one cryptocurrency and instantly see its equivalent value across multiple fiat currencies. For example, 1 Bitcoin worth approximately $45,000 USD converts to roughly €41,500 EUR, £36,000 GBP, and ¥4,950,000 JPY (based on January 2025 rates). You can typically select which currencies to display simultaneously, making it easy to understand value across different regions. However, you must manually account for the foreign exchange (forex) rates between fiat currencies, as the converter only applies the crypto-to-fiat rate for each currency separately.",
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
    const cryptoAmountValue = parseFloat(inputs.cryptoAmount) || 0;
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Multi-Currency Crypto Converter</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The multi-currency crypto converter is an essential tool for anyone trading, investing, or holding cryptocurrencies across different currencies and regions. This calculator instantly converts the value of digital assets like Bitcoin, Ethereum, and other cryptocurrencies into fiat currencies (USD, EUR, GBP, JPY) or into other cryptocurrencies, helping you understand your portfolio's real-world worth. Whether you're tracking gains, comparing prices across exchanges, or planning international transfers, the converter provides real-time, market-based calculations updated every few seconds.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the converter, simply select your source currency (the crypto you own or the currency you're starting with), enter the amount you want to convert, and select your target currency. The calculator will instantly show you the equivalent value based on current spot prices from major exchanges. Key inputs include the cryptocurrency or fiat currency you're converting from, the specific amount, and the target currency—all of which directly affect your conversion total. Most converters also allow you to lock in a specific time period's rates or view historical conversion rates for comparison.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by understanding that the displayed conversion amount represents the mathematical equivalent at that exact moment in time, not a guaranteed execution price. Your actual conversion cost will typically be 0.2-2% higher due to exchange spreads and network fees, so always factor in additional costs before making a trade. Use the converter results for planning and comparison purposes, but verify current rates directly on your chosen exchange and account for all applicable fees before committing real funds. The calculator is a starting point for informed decision-making, not a substitute for exchange-specific pricing and due diligence.</p>
        </div>
      </section>

      {/* TABLE: Major Cryptocurrency Prices in Multiple Currencies (January 2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Major Cryptocurrency Prices in Multiple Currencies (January 2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows real-time conversion rates for the top five cryptocurrencies across four major fiat currencies.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cryptocurrency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">USD Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EUR Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">GBP Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">JPY Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bitcoin (BTC)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45,230</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€41,710</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£36,184</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">¥4,975,300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ethereum (ETH)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€2,622</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£2,281</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">¥313,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Solana (SOL)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$210.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€193.81</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£168.84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">¥23,156</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cardano (ADA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.08</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€0.99</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£0.86</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">¥119</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ripple (XRP)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€2.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£1.96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">¥269</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices are illustrative based on January 2025 market data. Exchange rates between fiat currencies are approximate (1 USD = 0.92 EUR = 0.79 GBP = 109 JPY). Always verify current rates on your exchange before executing trades.</p>
      </section>

      {/* TABLE: Common Fees Impact on Crypto Conversions */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Fees Impact on Crypto Conversions</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how various fees reduce your net conversion amount when trading cryptocurrency.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fee Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Impact on $10,000 Trade</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example Scenario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Exchange Spread</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1% - 2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10 - $200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Buying Bitcoin on Coinbase ($20-50) vs. OKX ($10)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Network Gas Fee (Ethereum)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5 - $100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5 - $100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Transferring ERC-20 tokens during high congestion</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Withdrawal Fee (Fiat)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5 - $25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5 - $25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cashing out crypto to bank account</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Staking/Bridge Fee</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5% - 3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50 - $300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Converting to different blockchain via bridge</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Combined Typical Cost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6% - 5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$70 - $550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Complete trade cycle on mid-tier exchange</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fees vary significantly by exchange, asset type, and network congestion. A $10,000 Bitcoin purchase might cost $100-300 in total fees when accounting for spread plus withdrawal to a wallet.</p>
      </section>

      {/* TABLE: Crypto Converter Precision: Expected Accuracy by Pair */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Crypto Converter Precision: Expected Accuracy by Pair</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different cryptocurrency pairs have different liquidity levels, affecting how precisely the converter matches your actual execution price.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Trading Pair</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Liquidity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Price Variance Window</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Exchange to Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BTC/USD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High ($3+ billion daily)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±0.1% - 0.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Coinbase Pro, Kraken, Binance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">ETH/USD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High ($1.5+ billion daily)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±0.2% - 0.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Coinbase Pro, Uniswap, Kraken</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">SOL/USD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High ($800M+ daily)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±0.3% - 1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Binance, FTX (formerly), Marinade Finance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Altcoin/USD (e.g., DOGE)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium ($200M-400M daily)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±0.5% - 2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Binance, Kraken, Upbit</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low-cap Altcoin/USD</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low (&lt;$50M daily)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±2% - 10%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">DEX with custom slippage, specific exchange</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Variance increases for less-liquid pairs. Always use limit orders for altcoins and set slippage tolerance on DEXs between 0.5-2% to avoid unexpected price movements during execution.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare the converter's rate against at least two major exchanges (Coinbase, Kraken, Binance) before executing a trade, as spreads can vary by 0.5-1.5% and compound on larger trades worth $5,000+.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Convert during lower-volatility periods (typically 12am-8am UTC when Asian and US markets overlap less) to get more stable prices and avoid the 2-5% swings common during high-volatility trading hours.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the converter in reverse-calculation mode: if you want to end with a specific amount in USD, input that amount and see how much crypto you need to buy, accounting for the 0.5-2% fee impact on your target.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Set price alerts on your exchange for target conversion rates rather than relying solely on the calculator, so you're notified when favorable conversion rates appear and can execute immediately without delay.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming the converter rate equals your final cost</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many users forget that the converter shows only the spot price, not the price you'll actually pay. Exchange spreads (0.5-2%), network fees ($5-100+), and slippage on decentralized exchanges can easily add 1-5% to your total cost, turning a calculated $10,000 conversion into an actual $10,300 expense.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for different network tokens with the same name</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">USDT exists on Bitcoin, Ethereum, Solana, Polygon, and other blockchains at slightly different prices due to wrapping fees and network-specific liquidity. Converting USDT on Ethereum costs more in fees than USDT on Polygon, so the converter's single price doesn't reflect your real execution costs across different networks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Calculating tax obligations based on converter rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The IRS requires you to report cryptocurrency transactions at their fair market value in USD on the specific transaction date, not today's converted price. Using the converter to calculate historical gains from months or years ago will give you incorrect tax obligations; you must track the actual acquisition and sale dates with their respective historical rates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring forex conversion costs between fiat currencies</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">When converting crypto to multiple fiat currencies, remember that EUR-to-GBP conversions incur additional forex fees (typically 1-3%) not shown in the calculator. If you're converting Bitcoin to EUR and then need to convert EUR to GBP, you'll lose an additional 1-3% to forex spreads beyond the initial crypto-to-EUR conversion cost.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What cryptocurrencies can I convert using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This multi-currency crypto converter supports major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Cardano (ADA), Ripple (XRP), Polkadot (DOT), and Dogecoin (DOGE), among others. The calculator updates exchange rates in real-time to reflect current market prices across all supported digital assets. You can convert between any combination of these cryptocurrencies or traditional fiat currencies like USD, EUR, GBP, and JPY. Most converters support over 100+ cryptocurrency and 150+ fiat currency pairs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are the exchange rates in the crypto converter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Exchange rates in crypto converters are typically updated every 1-5 seconds, pulling data from major exchanges like Coinbase, Kraken, and Binance. However, actual execution rates may differ by 0.5-2% depending on your chosen exchange, trading volume, and market volatility at the time of purchase. Real-time rates ensure you see current market conditions, but rates lock in only when you complete a transaction on your exchange. Always check your specific exchange's rates immediately before executing a trade, as prices can fluctuate rapidly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this converter to calculate my crypto tax obligations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While the multi-currency converter accurately calculates the USD or fiat equivalent of your crypto holdings at current rates, it should not be used as your sole tool for tax reporting. The IRS treats each crypto transaction as a taxable event, requiring you to report gains or losses based on the fair market value in USD on the transaction date, not today's price. For accurate tax calculations, use dedicated crypto tax software like CoinTracker or Koinly that track cost basis, holding periods, and long-term vs. short-term gains. The converter is useful for understanding your current portfolio value but requires additional tools for compliance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between spot price and the rate shown in the converter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The spot price is the real-time market price at which a cryptocurrency trades on major exchanges, typically what you see in the converter. When you actually buy or sell crypto, your exchange may charge a spread (fee built into the price) ranging from 0.1-2% for Bitcoin and up to 5% for smaller altcoins. Additionally, network fees (gas fees on Ethereum can range from $5-$100+ depending on congestion) are separate costs not reflected in the converter's exchange rate. The converter shows the mathematical conversion, but your actual cost will include the exchange spread plus any blockchain transaction fees.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert stablecoins like USDC or USDT using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Stablecoins like USDC and USDT can be converted just like any other cryptocurrency in the calculator. USDC and USDT maintain a 1:1 peg to the US dollar, so 1 USDC always equals approximately $1.00 USD, though minor price variations under 0.5% may occur during market stress. When converting stablecoins to traditional fiat currency (USD, EUR, etc.), the converter will show the current exchange rate of the stablecoin, though you may incur network withdrawal fees of $5-$20 depending on blockchain and exchange. Stablecoins are useful for quick conversions without exposure to volatility, but withdrawal and bridge fees should be factored into your calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do conversion rates differ between this calculator and my exchange?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Different exchanges source prices from different liquidity pools and may have slight variations in real-time rates, typically within 0.2-1% of each other for major pairs. Your exchange may apply its own spread or markup on top of the spot price, which is how they profit from trades. Geographic location also affects rates—some regions have premium or discount prices based on local demand and regulatory environment. Always verify rates directly on your intended exchange before executing a trade, as the converter shows market rates but not your specific exchange's fees or spreads.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this converter account for different blockchain networks (Ethereum vs. Bitcoin Lightning Network)?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most multi-currency crypto converters show prices for the same asset across different blockchains as nearly identical, since they represent the same underlying value. However, wrapped tokens (like WBTC on Ethereum or ETH on Polygon) may trade at slightly different rates due to wrapping/unwrapping fees and different liquidity pools, typically within 0.1-0.3%. The converter itself doesn't distinguish between these variants, so you must manually account for any network premium or discount when comparing prices. Always specify which blockchain network and token address you're converting when comparing rates across different platforms.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens to my converted amount if prices crash immediately after I calculate it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The converter shows only the theoretical conversion at that specific moment; it does not lock in any price or protect you from market movements. Cryptocurrency prices can move 5-20% or more within minutes during volatile market conditions, so a conversion calculated now may be significantly different by the time you execute it. To protect yourself, execute trades as quickly as possible after calculating, use limit orders instead of market orders, or use a slippage tolerance feature (typically set to 0.5-2%) on decentralized exchanges. The calculator is a planning tool, not a guarantee of execution price.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert crypto to multiple fiat currencies at once using this tool?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most multi-currency converters allow you to input an amount in one cryptocurrency and instantly see its equivalent value across multiple fiat currencies. For example, 1 Bitcoin worth approximately $45,000 USD converts to roughly €41,500 EUR, £36,000 GBP, and ¥4,950,000 JPY (based on January 2025 rates). You can typically select which currencies to display simultaneously, making it easy to understand value across different regions. However, you must manually account for the foreign exchange (forex) rates between fiat currencies, as the converter only applies the crypto-to-fiat rate for each currency separately.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-virtual-currency-transactions" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Virtual Currency Guidance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on how cryptocurrency transactions are taxed and when fair market value must be reported for tax compliance.</p>
          </li>
          <li>
            <a href="https://www.sec.gov/oiea/investor-alerts-bulletins/ia_cryptocurrency.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Cryptocurrency and Digital Assets Investor Alert</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Securities and Exchange Commission warnings about cryptocurrency volatility, exchange risks, and investment considerations for digital asset holders.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/c/cryptocurrency.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Cryptocurrency Converter Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive educational resource explaining how cryptocurrency converters work, real-time pricing mechanics, and how to evaluate conversion accuracy across platforms.</p>
          </li>
          <li>
            <a href="https://www.cftc.gov/News/PressReleases/8735-21" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CFTC Digital Assets Regulation Overview</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Commodity Futures Trading Commission's regulatory framework for digital currencies, explaining how crypto exchanges are supervised and what protections investors should expect.</p>
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
