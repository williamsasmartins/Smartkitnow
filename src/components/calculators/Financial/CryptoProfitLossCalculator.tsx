import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CryptoProfitLossCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    buyPrice: "", 
    sellPrice: "", 
    quantity: "" 
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
    const buyPrice = parseFloat(inputs.buyPrice) || 0;
    const sellPrice = parseFloat(inputs.sellPrice) || 0;
    const quantity = parseFloat(inputs.quantity) || 0;

    // Validate
    if (buyPrice <= 0 || sellPrice <= 0 || quantity <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const profitLoss = (sellPrice - buyPrice) * quantity;
    const roi = ((sellPrice - buyPrice) / buyPrice) * 100;
    const breakEvenPrice = buyPrice;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      price: buyPrice + (i * (sellPrice - buyPrice) / 11),
      balance: (buyPrice + (i * (sellPrice - buyPrice) / 11)) * quantity
    }));

    return { 
      mainResult: profitLoss, 
      result2: roi, 
      result3: breakEvenPrice, 
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
    setInputs({ buyPrice: "", sellPrice: "", quantity: "" });
  };

  const faqs = [
    {
      question: "How do I calculate my crypto gains if I bought Bitcoin at $35,000 and sold at $63,000?",
      answer: "Your gross profit would be $28,000 per Bitcoin ($63,000 - $35,000). To calculate your net profit/loss, subtract any transaction fees, trading commissions, and gas fees from this amount. If you paid $500 in total fees, your actual profit would be $27,500. The crypto profit/loss calculator automates this by allowing you to input your entry price, exit price, quantity, and fees to instantly determine your taxable gain or loss.",
    },
    {
      question: "What's the difference between realized and unrealized gains on the calculator?",
      answer: "Realized gains occur when you actually sell your cryptocurrency, while unrealized gains are paper profits from holdings that haven't been sold yet. This calculator focuses on realized gains/losses since those are what trigger tax events and determine your actual profits. For example, if you bought Ethereum at $2,000 and it's now worth $3,500 but you haven't sold, that's an unrealized gain of $1,500—not yet taxable.",
    },
    {
      question: "Should I include trading fees and gas fees in my profit calculation?",
      answer: "Yes, absolutely. Trading fees on exchanges like Coinbase typically range from 0.5% to 4% of your transaction, while Ethereum gas fees can vary from $5 to $200+ depending on network congestion. The IRS allows these fees to be deducted from your gains, so including them in the calculator reduces your taxable profit. For a $10,000 trade with 2% fees ($200), your actual profit basis decreases by that amount.",
    },
    {
      question: "Can this calculator help me with tax reporting for the IRS?",
      answer: "Yes, the calculator helps you calculate your realized gains and losses, which are reported on Schedule D (Form 1040) and potentially Form 8949. However, it doesn't replace professional tax software or a CPA—you'll need to track your cost basis, holding period (short-term vs. long-term), and aggregate all transactions across exchanges. Long-term capital gains (held 1+ year) are taxed at 0%, 15%, or 20% depending on income, while short-term gains are taxed as ordinary income up to 37%.",
    },
    {
      question: "What if I made multiple crypto trades—can I calculate my total P&L?",
      answer: "Yes, most crypto profit/loss calculators allow you to input multiple transactions across different dates and prices. You can calculate individual trade profits and then sum them to see your overall portfolio performance. For tax purposes, the IRS treats each transaction separately for short-term vs. long-term classification, so tracking each buy and sell is critical for accurate tax reporting.",
    },
    {
      question: "How does the calculator handle crypto-to-crypto trades, like swapping Ethereum for Bitcoin?",
      answer: "Crypto-to-crypto swaps are taxable events in the U.S. This means when you exchange Ethereum for Bitcoin, you're selling the Ethereum at its fair market value on that date and buying Bitcoin—triggering a capital gain or loss. The calculator should account for the fair market value of both cryptocurrencies at the time of the swap. If you swapped $5,000 worth of Ethereum for Bitcoin and Ethereum was up 20% since purchase, you owe taxes on that $1,000 gain.",
    },
    {
      question: "What cost basis method should I use if I don't remember exactly which coins I sold?",
      answer: "The IRS allows three methods: FIFO (First-In-First-Out, the default), LIFO (Last-In-First-Out), and specific identification. FIFO assumes you sell your oldest coins first, which often maximizes short-term gains. LIFO can sometimes reduce your tax burden by selling newer, higher-priced coins. Most traders use FIFO by default, but the calculator should let you specify your method since it significantly impacts your taxable gain or loss.",
    },
    {
      question: "Can I use this calculator to offset gains with losses for tax purposes?",
      answer: "Yes—this is called tax-loss harvesting. If you sold Bitcoin for a $5,000 loss and Ethereum for an $8,000 gain, you can net them to show a $3,000 overall gain, reducing your tax liability. You can also carry forward capital losses up to $3,000 per year against ordinary income, with unlimited carryforward of excess losses. The calculator helps you identify both gains and losses to optimize your tax strategy.",
    },
    {
      question: "How accurate is the calculator if I'm using spot prices from different times of day?",
      answer: "Crypto prices fluctuate every minute, so using prices from different times can create discrepancies. For tax accuracy, you should use the price at the exact time of your transaction—most exchanges provide this in your transaction history. CoinMarketCap and CoinGecko offer historical price data, and the calculator is most accurate when you input prices with timestamps. A Bitcoin price swing from $45,000 to $46,000 could change your profit calculation by $1,000 per coin.",
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
              Buy Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.buyPrice}
              onChange={(e) => setInputs({ ...inputs, buyPrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Sell Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 55000"
              value={inputs.sellPrice}
              onChange={(e) => setInputs({ ...inputs, sellPrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Quantity
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2"
              value={inputs.quantity}
              onChange={(e) => setInputs({ ...inputs, quantity: e.target.value })}
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
      {results.mainResult !== 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Profit/Loss
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
                      Return on Investment (ROI)
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.result2.toFixed(2)}%
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
                      Break-Even Price
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

          {/* SCHEDULE TABLE (if applicable) */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Price Schedule
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
                        : `Show All ${results.scheduleData.length} Prices`}
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
                        <TableHead className="font-semibold">Price</TableHead>
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
                            <TableCell>{formatCurrency(row.price)}</TableCell>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Crypto Profit/Loss Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Crypto Profit/Loss Calculator is designed to quickly determine your realized gains or losses from cryptocurrency transactions. This is essential for tax reporting, portfolio performance tracking, and investment decision-making. Whether you're a day trader managing hundreds of transactions or a long-term holder selling a portion of your portfolio, this calculator eliminates manual math errors and ensures you capture every fee that reduces your taxable profit.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need your transaction details: the cryptocurrency type (Bitcoin, Ethereum, etc.), the price you bought (entry price), the price you sold (exit price), the quantity transacted, and any fees incurred (trading commissions, gas fees, withdrawal fees). Most exchanges provide these details in your transaction history or CSV export files. Accuracy is critical—entering a $1,000 price difference per coin on even one Bitcoin transaction changes your result by $1,000, so double-check your data before calculating.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs your realized profit or loss, which you'll use for tax reporting on Schedule D and Form 8949. Pay attention to whether your gain or loss is short-term (held under 1 year, taxed as ordinary income) or long-term (held 1+ year, taxed at preferential rates of 0%, 15%, or 20%). If the result is negative, congratulations—you can use that loss to offset other gains or up to $3,000 of ordinary income for tax relief. Document your calculation with screenshots or exports for IRS compliance.</p>
        </div>
      </section>

      {/* TABLE: Sample Crypto Profit/Loss Scenarios (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Crypto Profit/Loss Scenarios (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These scenarios illustrate how entry price, exit price, quantity, and fees impact your final profit or loss.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cryptocurrency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Entry Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Exit Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Quantity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Trading Fees</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Net Profit/Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bitcoin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$63,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 BTC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term (if held 1+ year)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ethereum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 ETH</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$1,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Taxable loss</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bitcoin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$42,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5 BTC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Short-term (if held <1 year)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Solana</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$195</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 SOL</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,025</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term (if held 1+ year)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Tax classification assumes long-term holding for assets held 365+ days; short-term for holdings <365 days. Tax rates vary by income bracket and filing status. Consult a tax professional for your specific situation.</p>
      </section>

      {/* TABLE: Typical Exchange Fees and Gas Costs (2024-2025) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Exchange Fees and Gas Costs (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Fee structures vary by exchange and network, affecting your actual profit calculation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Exchange / Network</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maker Fee</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Taker Fee</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Gas/Network Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Impact on $10,000 Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Coinbase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Included</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kraken</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.16%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.26%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Included</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$26</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Binance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Included</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ethereum Network (ERC-20)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5–$200+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5–$200+</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bitcoin Network</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2–$30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2–$30</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gas fees on Ethereum fluctuate dramatically based on network congestion; figures shown are average estimates during peak and off-peak hours. Always include network fees in your cost basis for accurate P&L calculation.</p>
      </section>

      {/* TABLE: U.S. Federal Capital Gains Tax Rates (2024–2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">U.S. Federal Capital Gains Tax Rates (2024–2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Your tax rate depends on your holding period and income bracket; this table shows the federal rates for single filers.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Holding Period</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0% Rate (Income Limit)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15% Rate (Income Limit)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20% Rate (Income Limit)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Long-term (1+ year)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to $47,025</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$47,025–$518,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Over $518,900</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Short-term (<1 year)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Taxed as ordinary income—up to 37%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Taxed as ordinary income—up to 37%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Taxed as ordinary income—up to 37%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Income thresholds for 2024 tax year; 2025 figures may vary with inflation adjustments. State taxes (0–13%) and Net Investment Income Tax (3.8% for high earners) also apply. Consult a tax professional for your full tax liability.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your exact transaction timestamp, not just the date—crypto prices fluctuate hourly, and using CoinMarketCap or your exchange's historical price data at the precise time ensures IRS-compliant accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't forget about small fees; a $50 mining or withdrawal fee may seem minor, but across 50 transactions, that's $2,500 in deductible costs that reduce your taxable gain.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to test different cost-basis methods (FIFO vs. LIFO) if you have high trading volume—switching methods could reduce your tax bill by thousands of dollars, though you must elect your method before filing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Export your calculator results and save them with your exchange statements and wallet records; the IRS may request proof of cost basis, purchase dates, and sale dates during an audit, and complete documentation is your strongest defense.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring staking rewards and airdrops as taxable income</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many traders forget that crypto staking rewards and airdrops are immediately taxable at fair market value when received, separate from later capital gains. If you earned 5 ETH in staking rewards worth $9,000 when received, that's $9,000 in ordinary income—even if you haven't sold the ETH yet and it's now worth $8,000.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using current price instead of transaction price</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator requires the actual price you bought or sold at, not today's price. If Bitcoin was $40,000 when you bought but is now $65,000, you must use $40,000 for your entry price, not $65,000—otherwise your profit calculation is completely wrong.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for wash sales rules</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While crypto doesn't have strict IRS wash-sale rules like stocks, the IRS is increasingly scrutinizing same-day or near-simultaneous buy-sell transactions. Selling Bitcoin for a loss and buying it back within days could trigger audit scrutiny, even if technically allowed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not converting foreign exchange rates for international purchases</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you bought crypto on a foreign exchange when 1 Bitcoin cost €35,000 (approximately $38,000 USD at that time), you must convert using the exchange rate on that transaction date, not today's rate. Using today's rate inflates or deflates your cost basis incorrectly.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my crypto gains if I bought Bitcoin at $35,000 and sold at $63,000?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your gross profit would be $28,000 per Bitcoin ($63,000 - $35,000). To calculate your net profit/loss, subtract any transaction fees, trading commissions, and gas fees from this amount. If you paid $500 in total fees, your actual profit would be $27,500. The crypto profit/loss calculator automates this by allowing you to input your entry price, exit price, quantity, and fees to instantly determine your taxable gain or loss.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between realized and unrealized gains on the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Realized gains occur when you actually sell your cryptocurrency, while unrealized gains are paper profits from holdings that haven't been sold yet. This calculator focuses on realized gains/losses since those are what trigger tax events and determine your actual profits. For example, if you bought Ethereum at $2,000 and it's now worth $3,500 but you haven't sold, that's an unrealized gain of $1,500—not yet taxable.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include trading fees and gas fees in my profit calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, absolutely. Trading fees on exchanges like Coinbase typically range from 0.5% to 4% of your transaction, while Ethereum gas fees can vary from $5 to $200+ depending on network congestion. The IRS allows these fees to be deducted from your gains, so including them in the calculator reduces your taxable profit. For a $10,000 trade with 2% fees ($200), your actual profit basis decreases by that amount.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me with tax reporting for the IRS?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator helps you calculate your realized gains and losses, which are reported on Schedule D (Form 1040) and potentially Form 8949. However, it doesn't replace professional tax software or a CPA—you'll need to track your cost basis, holding period (short-term vs. long-term), and aggregate all transactions across exchanges. Long-term capital gains (held 1+ year) are taxed at 0%, 15%, or 20% depending on income, while short-term gains are taxed as ordinary income up to 37%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I made multiple crypto trades—can I calculate my total P&L?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, most crypto profit/loss calculators allow you to input multiple transactions across different dates and prices. You can calculate individual trade profits and then sum them to see your overall portfolio performance. For tax purposes, the IRS treats each transaction separately for short-term vs. long-term classification, so tracking each buy and sell is critical for accurate tax reporting.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator handle crypto-to-crypto trades, like swapping Ethereum for Bitcoin?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Crypto-to-crypto swaps are taxable events in the U.S. This means when you exchange Ethereum for Bitcoin, you're selling the Ethereum at its fair market value on that date and buying Bitcoin—triggering a capital gain or loss. The calculator should account for the fair market value of both cryptocurrencies at the time of the swap. If you swapped $5,000 worth of Ethereum for Bitcoin and Ethereum was up 20% since purchase, you owe taxes on that $1,000 gain.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What cost basis method should I use if I don't remember exactly which coins I sold?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The IRS allows three methods: FIFO (First-In-First-Out, the default), LIFO (Last-In-First-Out), and specific identification. FIFO assumes you sell your oldest coins first, which often maximizes short-term gains. LIFO can sometimes reduce your tax burden by selling newer, higher-priced coins. Most traders use FIFO by default, but the calculator should let you specify your method since it significantly impacts your taxable gain or loss.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to offset gains with losses for tax purposes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—this is called tax-loss harvesting. If you sold Bitcoin for a $5,000 loss and Ethereum for an $8,000 gain, you can net them to show a $3,000 overall gain, reducing your tax liability. You can also carry forward capital losses up to $3,000 per year against ordinary income, with unlimited carryforward of excess losses. The calculator helps you identify both gains and losses to optimize your tax strategy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the calculator if I'm using spot prices from different times of day?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Crypto prices fluctuate every minute, so using prices from different times can create discrepancies. For tax accuracy, you should use the price at the exact time of your transaction—most exchanges provide this in your transaction history. CoinMarketCap and CoinGecko offer historical price data, and the calculator is most accurate when you input prices with timestamps. A Bitcoin price swing from $45,000 to $46,000 could change your profit calculation by $1,000 per coin.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/pub/irs-pdf/p544.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 544: Sales of Assets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on calculating and reporting gains and losses from asset sales, including cryptocurrency transactions.</p>
          </li>
          <li>
            <a href="https://www.sec.gov/newsroom/public-statements/statement-digital-assets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Division of Corporation Finance: Cryptocurrency and Digital Asset Guidance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SEC information on how cryptocurrency transactions are regulated and taxed under federal securities laws.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/c/capital_gains_tax.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Capital Gains Tax Explained</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed explanation of short-term and long-term capital gains tax rates, holding periods, and how to calculate taxable gains.</p>
          </li>
          <li>
            <a href="https://coinmarketcap.com/historical/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CoinMarketCap: Historical Cryptocurrency Price Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Free tool to look up historical cryptocurrency prices by date, essential for verifying transaction prices for accurate P&L calculations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Crypto Profit/Loss Calculator"
      description="Calculate profit or loss on your crypto trades. Input buy and sell prices to see your exact Return on Investment."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Crypto Profit/Loss Calculator" },
        { id: "formula", label: "Crypto Profit/Loss Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Profit/Loss = (Sell Price - Buy Price) × Quantity",
        variables: [
          { symbol: "Sell Price", description: "The price at which the cryptocurrency was sold" },
          { symbol: "Buy Price", description: "The price at which the cryptocurrency was purchased" },
          { symbol: "Quantity", description: "The amount of cryptocurrency traded" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you bought 2 BTC at $50,000 each and sold them at $55,000 each.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "(55,000 - 50,000) × 2 = 10,000", 
            explanation: "Calculate the profit by finding the difference in buy and sell prices and multiplying by quantity." 
          },
          { 
            label: "Step 2", 
            calculation: "10,000 / (50,000 × 2) × 100 = 10%", 
            explanation: "Determine the ROI by dividing the profit by the total buy cost and multiplying by 100." 
          },
          { 
            label: "Step 3", 
            calculation: "50,000 = Break-Even Price", 
            explanation: "The break-even price is the buy price in this scenario." 
          }
        ],
        result: "The final result is a $10,000 profit with a 10% ROI, meaning you gained 10% on your investment."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📊" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "📈" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}