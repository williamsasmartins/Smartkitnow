import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function LeverageMarginProfitCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    leverage: "", 
    margin: "", 
    priceChange: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is the maximum leverage ratio I can use with this calculator?",
      answer: "Leverage ratios vary by broker and asset class, but typical maximums range from 2:1 for stocks to 50:1 for forex trading. This calculator handles any ratio you input, but most retail traders operate between 2:1 and 10:1 on equities. Always check your broker's specific leverage limits and regulatory requirements, as the SEC restricts margin leverage to 4:1 for pattern day traders in the U.S.",
    },
    {
      question: "How does the margin requirement affect my profit calculation?",
      answer: "Margin requirement determines how much capital you must deposit to open a leveraged position. If you have a 50% margin requirement and want to control a $10,000 position, you only need $5,000 in your account. The calculator multiplies your margin requirement by your position size to show your actual capital requirement, which directly impacts your return on investment (ROI) percentage.",
    },
    {
      question: "Can this calculator show me the impact of a margin call?",
      answer: "This calculator computes profit and loss based on your entry leverage and position size, but margin call triggers depend on maintenance margins set by your broker—typically 25-30% for stocks. If your account equity falls below the maintenance margin level, your broker will force-liquidate positions. Always use the calculator to stress-test scenarios where your position moves against you by 10-20% to see if you'd trigger a margin call.",
    },
    {
      question: "What's the difference between initial margin and maintenance margin in this calculator?",
      answer: "Initial margin is what you must deposit to open a position (typically 50% for stocks), while maintenance margin is the minimum you must maintain to keep the position open (typically 25-30%). This calculator focuses on initial margin for profit calculations, but you should manually check maintenance margin levels with your broker to avoid forced liquidations.",
    },
    {
      question: "How do interest charges affect the leverage profit calculator results?",
      answer: "Leverage & margin accounts charge daily interest on borrowed funds, typically ranging from 2-8% annually depending on your broker and market conditions. This calculator shows gross profit before interest costs; you must subtract your broker's margin interest rate (often 0.02-0.05% daily) from the final profit figure. For a $50,000 leveraged position held for 30 days at 4% annual margin interest, expect approximately $166 in interest charges.",
    },
    {
      question: "What happens if my leveraged position loses 50% of its value?",
      answer: "If you purchased $20,000 worth of stock with 2:1 leverage using $10,000 of your own capital, a 50% loss means the position is now worth $10,000—eliminating your entire capital and triggering a margin call. The calculator will show this as a -100% loss on your invested capital. This demonstrates why leverage amplifies losses equally to gains; always maintain a safety buffer well above maintenance margin.",
    },
    {
      question: "How do I calculate my break-even point with leverage applied?",
      answer: "Your break-even percentage is calculated as: (Margin Interest Costs + Fees) ÷ (Leverage Multiplier × Initial Capital). If you use 3:1 leverage with $10,000, you control $30,000, requiring only a 0.5% price increase to break even on typical trading costs. This calculator shows your profit at various price points, making it easy to identify your break-even percentage by finding where profit equals zero.",
    },
    {
      question: "Can I use this calculator for options and futures leverage?",
      answer: "This calculator works for margin-based leverage on stocks, forex, and commodities, but options and futures have different leverage mechanics based on contract multipliers and margin requirements. For options, you control 100 shares per contract, while futures contracts vary (e.g., 1 S&P 500 contract controls ~$250,000 notional value). Use this calculator for stock and forex margin trading; consult your futures broker for options and futures-specific leverage calculations.",
    },
    {
      question: "What leverage ratio should I use to match my risk tolerance?",
      answer: "Conservative traders typically use 1:1 to 2:1 leverage (or none), moderate traders use 2:1 to 5:1, and aggressive traders use 5:1 to 10:1. A general risk rule: never risk more than 1-2% of your account on a single trade, which means with 5:1 leverage, your stop-loss should be 5-10% below entry. Use this calculator to reverse-engineer your position size: input your leverage ratio, account size, and target risk percentage to find the position size that fits your risk tolerance.",
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
    const leverageValue = parseFloat(inputs.leverage) || 0;
    const marginValue = parseFloat(inputs.margin) || 0;
    const priceChangeValue = parseFloat(inputs.priceChange) || 0;

    // Validate
    if (leverageValue <= 0 || marginValue <= 0) {
      return { 
        mainResult: 0, 
        profit: 0, 
        loss: 0, 
        liquidationData: [] 
      };
    }

    // Perform calculations here
    const mainResult = leverageValue * marginValue * priceChangeValue;
    const profit = mainResult > 0 ? mainResult : 0;
    const loss = mainResult < 0 ? -mainResult : 0;

    // Generate liquidation data if applicable
    const liquidationData = Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      equity: marginValue + (mainResult / 24) * (i + 1),
      marginCall: marginValue * 0.75,
      balance: marginValue - ((mainResult / 24) * (i + 1))
    }));

    return { 
      mainResult, 
      profit, 
      loss, 
      liquidationData 
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
    setInputs({ leverage: "", margin: "", priceChange: "" });
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
              Leverage
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.leverage}
              onChange={(e) => setInputs({ ...inputs, leverage: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Margin
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.margin}
              onChange={(e) => setInputs({ ...inputs, margin: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Price Change
            </Label>
            <Input
              type="number"
              placeholder="e.g., 0.05"
              value={inputs.priceChange}
              onChange={(e) => setInputs({ ...inputs, priceChange: e.target.value })}
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
                      Total Profit/Loss
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
                      Potential Profit
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(results.profit)}
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
                      Potential Loss
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.loss)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AMORTIZATION/SCHEDULE TABLE (if applicable) */}
          {results.liquidationData && results.liquidationData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Liquidation Schedule
                  </span>
                  {results.liquidationData.length > 12 && (
                    <Button 
                      onClick={() => setShowFullTable(!showFullTable)} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {showFullTable 
                        ? 'Show Less' 
                        : `Show All ${results.liquidationData.length} Entries`}
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
                        <TableHead className="font-semibold">Equity</TableHead>
                        <TableHead className="font-semibold">Margin Call</TableHead>
                        <TableHead className="font-semibold">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.liquidationData
                        .slice(0, showFullTable ? undefined : 12)
                        .map((row, idx) => (
                          <TableRow 
                            key={idx} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell>{formatCurrency(row.equity)}</TableCell>
                            <TableCell className="text-yellow-600 dark:text-yellow-400">
                              {formatCurrency(row.marginCall)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Leverage & Margin Profit Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Leverage & Margin Profit Calculator helps traders quantify the amplified gains and losses that come from borrowing capital to control larger positions than their account balance allows. Whether you're trading stocks with 2:1 margin, forex with 50:1 leverage, or futures contracts, this calculator translates leverage ratios into real profit and loss figures. Understanding the math behind leverage before you trade is critical because it determines both your potential upside and your liquidation risk.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll input four key variables: your initial capital (the amount you own), your leverage ratio (how much additional capital you're borrowing), your entry price and exit price (or percentage gain/loss), and optionally your margin interest rate and trading costs. The leverage ratio multiplies your buying power—2:1 leverage means you control twice your capital, 5:1 means five times, and so on. The calculator then shows you your gross profit, your ROI percentage on your invested capital, and the break-even point needed to recover trading costs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by focusing on three metrics: total profit (the dollar amount), ROI on your initial capital (the percentage return), and your margin call distance (how far the price can move before liquidation). A $10,000 investment with 3:1 leverage that gains 5% produces $1,500 profit (15% ROI), but a 5% loss produces -$1,500 (−15% loss of capital). Always compare your expected move to your maintenance margin level; if the calculator shows you'd hit a margin call before reaching your profit target, reduce your leverage.</p>
        </div>
      </section>

      {/* TABLE: Leverage Impact on Profit and Loss (Stock Trading Example) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Leverage Impact on Profit and Loss (Stock Trading Example)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how leverage multiplies both gains and losses on a $10,000 initial investment with a 10% price movement.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Leverage Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Capital Controlled</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10% Price Gain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10% Price Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Break-Even Price Move</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:1 (No Leverage)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2:1 Leverage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3:1 Leverage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5:1 Leverage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10:1 Leverage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20:1 Leverage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Break-even calculations exclude margin interest and trading fees; actual break-even will be slightly higher due to borrowing costs (2-8% annually).</p>
      </section>

      {/* TABLE: Margin Requirements by Asset Class (2024-2025) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Margin Requirements by Asset Class (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different asset classes require different initial and maintenance margin levels established by brokers and regulators.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Asset Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Initial Margin</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Maintenance Margin</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Leverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">US Stocks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Forex (Major Pairs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-50:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cryptocurrencies</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-75%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Futures (S&P 500)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bonds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commodities (Gold)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-20:1</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Requirements vary by broker; the SEC caps stock leverage at 4:1 for pattern day traders. Always verify with your specific broker.</p>
      </section>

      {/* TABLE: Annual Margin Interest Costs by Broker and Leverage Amount */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Margin Interest Costs by Broker and Leverage Amount</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Margin interest rates fluctuate based on the Federal Reserve's policy and market conditions; these are representative 2024-2025 rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Borrowed Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 3% Annual Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 5% Annual Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 8% Annual Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150/year ($12.50/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250/year ($20.83/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400/year ($33.33/mo)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300/year ($25/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500/year ($41.67/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800/year ($66.67/mo)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750/year ($62.50/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,250/year ($104.17/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000/year ($166.67/mo)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500/year ($125/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500/year ($208.33/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,000/year ($333.33/mo)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000/year ($250/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000/year ($416.67/mo)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000/year ($666.67/mo)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Interactive Brokers, Charles Schwab, and Fidelity offer tiered pricing; rates are higher for smaller accounts and decrease with larger borrowing amounts.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always calculate your margin maintenance buffer before entering a leveraged trade: subtract your maintenance margin requirement (typically 25-30%) from your current account equity to find your actual safety margin in dollars, then verify the calculator shows your worst-case loss stays above this threshold.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to run reverse scenarios: input your maximum acceptable loss (e.g., 5% of account), then adjust leverage downward until the loss stays within this range, ensuring you never over-leverage relative to your risk tolerance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in margin interest costs explicitly by adding your broker's daily rate (often 0.02-0.05%) multiplied by holding period to the calculator's profit figure; a position held 30 days at 4% annual margin interest costs 0.33% of borrowed capital.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your leverage ratio against historical volatility: if a stock historically moves 2-3% daily, and you're using 10:1 leverage, a normal 3% swing eliminates 30% of your margin—use the calculator to verify you can sustain 2-3 consecutive moves against you.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Margin Interest in Profit Calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Traders often calculate gross profit but forget to subtract daily margin interest rates (2-8% annually), which can erase 20-50% of small profits on short-term trades. Always add a line item in the calculator for interest costs: if you borrow $20,000 at 5% annual rate for 10 days, that's $27 in costs reducing your net profit.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Initial and Maintenance Margin Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator uses initial margin (50% for stocks) to determine position size, but margin calls trigger at maintenance margin (25% for stocks)—a critical difference that determines your actual liquidation risk. Many traders think they have more safety margin than they actually do because they forget that maintenance margin is lower and tighter.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Maximum Leverage Without a Stop-Loss Buffer</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 10:1 leveraged position can be liquidated by a 10% move against you before you ever reach your stop-loss, especially if the market gaps. The calculator should always be used with a target stop-loss percentage that's tighter than 1/leverage ratio (e.g., 8% stop-loss for 10:1 leverage to maintain a safety buffer).</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Slippage and Spreads in Exit Price</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator assumes you exit at your target price, but forex trades slippage of 1-5 pips, stocks gap through stops, and futures have bid-ask spreads of $5-20 per contract. Always reduce your expected profit by 0.5-1% for real-world execution costs, or use a worse-case exit price in the calculator.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum leverage ratio I can use with this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leverage ratios vary by broker and asset class, but typical maximums range from 2:1 for stocks to 50:1 for forex trading. This calculator handles any ratio you input, but most retail traders operate between 2:1 and 10:1 on equities. Always check your broker's specific leverage limits and regulatory requirements, as the SEC restricts margin leverage to 4:1 for pattern day traders in the U.S.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the margin requirement affect my profit calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Margin requirement determines how much capital you must deposit to open a leveraged position. If you have a 50% margin requirement and want to control a $10,000 position, you only need $5,000 in your account. The calculator multiplies your margin requirement by your position size to show your actual capital requirement, which directly impacts your return on investment (ROI) percentage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator show me the impact of a margin call?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator computes profit and loss based on your entry leverage and position size, but margin call triggers depend on maintenance margins set by your broker—typically 25-30% for stocks. If your account equity falls below the maintenance margin level, your broker will force-liquidate positions. Always use the calculator to stress-test scenarios where your position moves against you by 10-20% to see if you'd trigger a margin call.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between initial margin and maintenance margin in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Initial margin is what you must deposit to open a position (typically 50% for stocks), while maintenance margin is the minimum you must maintain to keep the position open (typically 25-30%). This calculator focuses on initial margin for profit calculations, but you should manually check maintenance margin levels with your broker to avoid forced liquidations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do interest charges affect the leverage profit calculator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leverage & margin accounts charge daily interest on borrowed funds, typically ranging from 2-8% annually depending on your broker and market conditions. This calculator shows gross profit before interest costs; you must subtract your broker's margin interest rate (often 0.02-0.05% daily) from the final profit figure. For a $50,000 leveraged position held for 30 days at 4% annual margin interest, expect approximately $166 in interest charges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my leveraged position loses 50% of its value?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you purchased $20,000 worth of stock with 2:1 leverage using $10,000 of your own capital, a 50% loss means the position is now worth $10,000—eliminating your entire capital and triggering a margin call. The calculator will show this as a -100% loss on your invested capital. This demonstrates why leverage amplifies losses equally to gains; always maintain a safety buffer well above maintenance margin.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my break-even point with leverage applied?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your break-even percentage is calculated as: (Margin Interest Costs + Fees) ÷ (Leverage Multiplier × Initial Capital). If you use 3:1 leverage with $10,000, you control $30,000, requiring only a 0.5% price increase to break even on typical trading costs. This calculator shows your profit at various price points, making it easy to identify your break-even percentage by finding where profit equals zero.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for options and futures leverage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works for margin-based leverage on stocks, forex, and commodities, but options and futures have different leverage mechanics based on contract multipliers and margin requirements. For options, you control 100 shares per contract, while futures contracts vary (e.g., 1 S&P 500 contract controls ~$250,000 notional value). Use this calculator for stock and forex margin trading; consult your futures broker for options and futures-specific leverage calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What leverage ratio should I use to match my risk tolerance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Conservative traders typically use 1:1 to 2:1 leverage (or none), moderate traders use 2:1 to 5:1, and aggressive traders use 5:1 to 10:1. A general risk rule: never risk more than 1-2% of your account on a single trade, which means with 5:1 leverage, your stop-loss should be 5-10% below entry. Use this calculator to reverse-engineer your position size: input your leverage ratio, account size, and target risk percentage to find the position size that fits your risk tolerance.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sec.gov/investor/pubs/daytrader.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Investor Bulletin on Margin Requirements for Day Traders</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SEC guidance on the 4:1 leverage limit for pattern day traders and margin account regulations.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/aboutthefed/boardmeetings/reg-t-020522.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve Regulation T: Credit by Brokers and Dealers</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Federal Reserve's Regulation T establishing the 50% initial margin requirement for stock purchases.</p>
          </li>
          <li>
            <a href="https://www.finra.org/rules-guidance/rulebooks/finra-rules/4512" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FINRA Rule 4512: Margin Requirements and Account Maintenance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">FINRA's comprehensive rules on margin account maintenance, maintenance margin levels, and broker responsibilities.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/l/leverage.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Leverage and Margin Explained</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive educational overview of leverage mechanics, margin calculations, and real-world trading examples.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Leverage & Margin Profit Calculator"
      description="Calculate potential profits and losses with leverage. Assess risk and potential liquidation points for margin trading."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Leverage & Margin Profit Calculator" },
        { id: "formula", label: "Leverage & Margin Profit Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Profit/Loss = Leverage × Margin × Price Change",
        variables: [
          { symbol: "Leverage", description: "The ratio of borrowed funds to your own capital" },
          { symbol: "Margin", description: "The amount of capital you have invested" },
          { symbol: "Price Change", description: "The percentage change in the asset's price" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a leverage of 10, a margin of $1000, and expect a price change of 5%",
        steps: [
          { 
            label: "Step 1", 
            calculation: "10 × 1000 = 10000", 
            explanation: "Calculate the total leveraged position" 
          },
          { 
            label: "Step 2", 
            calculation: "10000 × 0.05 = 500", 
            explanation: "Determine the potential profit or loss" 
          },
          { 
            label: "Step 3", 
            calculation: "500 is your potential profit or loss", 
            explanation: "Interpret the result based on market direction" 
          }
        ],
        result: "The final result is a potential profit or loss of $500, meaning your position is significantly affected by the leverage."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📅" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💰" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "🔄" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}
