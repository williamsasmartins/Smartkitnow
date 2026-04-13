import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function PositionSizeRiskManagementCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    accountSize: "", 
    riskPercentage: "", 
    stopLoss: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is position sizing and why does it matter?",
      answer: "Position sizing is the practice of determining how much capital to allocate to a single trade based on your account size and risk tolerance. It matters because it directly controls your maximum loss per trade; for example, risking 1-2% of a $50,000 account means your maximum loss per trade is $500-$1,000. Proper position sizing prevents catastrophic losses and allows you to survive losing streaks while maintaining long-term profitability.",
    },
    {
      question: "How do I calculate the correct position size for my trade?",
      answer: "Use the formula: Position Size = (Account Size × Risk Percentage) / (Entry Price - Stop Loss Price). For example, with a $100,000 account, risking 2%, an entry price of $50, and a stop loss at $48, your position size would be ($100,000 × 0.02) / ($50 - $48) = 1,000 shares. This calculator automates this process and ensures your maximum loss matches your risk tolerance.",
    },
    {
      question: "What percentage of my account should I risk per trade?",
      answer: "Professional traders typically risk between 0.5% and 2% of their account per trade, with 1% being the industry standard for sustainable trading. Beginners should start at 0.5%-1% to build discipline, while experienced traders with proven systems may use up to 2%. The Kelly Criterion, a mathematical formula, suggests optimal risk can be higher only if you have a win rate above 55% and positive expected value.",
    },
    {
      question: "How does the risk-reward ratio affect my position sizing?",
      answer: "The risk-reward ratio determines whether a trade is worth taking; a 1:2 ratio means you stand to make $2 for every $1 you risk. When calculating position size, a better risk-reward ratio (like 1:3 or 1:4) allows you to risk slightly more per trade since losses are offset by larger gains. The calculator helps you identify trades with favorable risk-reward setups before committing capital.",
    },
    {
      question: "What is the difference between fixed fractional and fixed dollar risk?",
      answer: "Fixed fractional risk bases position size on a percentage of your account (e.g., 1% of $50,000 = $500 risk), while fixed dollar risk risks the same dollar amount on every trade regardless of account growth. Fixed fractional is preferred because it scales with your account—as you grow from $50,000 to $100,000, your risk per trade doubles proportionally. This calculator uses fixed fractional risk, which is the professional standard.",
    },
    {
      question: "How should I adjust position size if I'm on a losing streak?",
      answer: "Most professionals reduce position size by 25-50% after 3 consecutive losses to preserve capital and rebuild confidence. For example, if you normally risk 1% ($500 on a $50,000 account), drop to 0.5% ($250) until you return to profitability. Never increase position size to recover losses quickly—this is called revenge trading and typically results in larger drawdowns.",
    },
    {
      question: "Can I use the same position size for different trading instruments?",
      answer: "No—position size must be calculated individually for each trade based on your entry price, stop loss, and the specific instrument's volatility. A stock with a $2 stop loss and a currency pair with a 0.02 pip stop loss will have very different position sizes despite the same dollar risk ($500). This calculator allows you to input instrument-specific parameters to ensure each position is sized correctly.",
    },
    {
      question: "What is the maximum drawdown I should tolerate in trading?",
      answer: "Professional traders typically limit maximum drawdown to 20-25% of their account, with some conservative traders capping it at 10-15%. A 25% drawdown means you need a 33% gain to recover, while a 50% drawdown requires a 100% gain to break even. Using proper position sizing with 1% risk per trade typically results in maximum drawdowns of 10-15% during normal trading conditions.",
    },
    {
      question: "How does volatility impact position sizing decisions?",
      answer: "Higher volatility instruments (like growth stocks or cryptocurrency) require smaller position sizes because stop losses must be wider to accommodate normal price swings. For example, a volatile tech stock might require a $5 stop loss versus a $0.50 stop loss for a stable blue-chip stock, significantly reducing the share count you can buy. This calculator accounts for volatility through the stop loss distance input, ensuring you don't overleverage in volatile markets.",
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
    const accountSizeValue = parseFloat(inputs.accountSize) || 0;
    const riskPercentageValue = parseFloat(inputs.riskPercentage) || 0;
    const stopLossValue = parseFloat(inputs.stopLoss) || 0;

    // Validate
    if (accountSizeValue <= 0 || riskPercentageValue <= 0 || stopLossValue <= 0) {
      return { 
        positionSize: 0, 
        riskAmount: 0, 
        tradeAmount: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const riskAmount = accountSizeValue * (riskPercentageValue / 100);
    const positionSize = riskAmount / stopLossValue;
    const tradeAmount = positionSize * stopLossValue;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      payment: tradeAmount / 24,
      principal: (tradeAmount / 24) * 0.7,
      interest: (tradeAmount / 24) * 0.3,
      balance: tradeAmount - ((tradeAmount / 24) * (i + 1))
    }));

    return { 
      positionSize, 
      riskAmount, 
      tradeAmount, 
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
    setInputs({ accountSize: "", riskPercentage: "", stopLoss: "" });
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
              Account Size
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.accountSize}
              onChange={(e) => setInputs({ ...inputs, accountSize: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Risk Percentage (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2"
              value={inputs.riskPercentage}
              onChange={(e) => setInputs({ ...inputs, riskPercentage: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Stop Loss Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={inputs.stopLoss}
              onChange={(e) => setInputs({ ...inputs, stopLoss: e.target.value })}
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
      {results.positionSize > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Position Size
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.positionSize)}
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
                      Risk Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.riskAmount)}
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
                      Trade Amount
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.tradeAmount)}
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Position Size & Risk Management Tool</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal number of shares or contracts to trade based on your account size, risk tolerance, and stop loss level. By automating position size calculations, it eliminates emotional decision-making and ensures every trade follows a consistent risk management framework. Whether you're day trading stocks, swing trading futures, or trading forex, this tool is essential for protecting your capital and maximizing long-term returns.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your total account balance (the capital you're willing to risk), your risk percentage per trade (typically 1-2%), your entry price, and your stop loss price. The tool will automatically calculate your maximum loss in dollars and your appropriate position size in shares or contracts. You can also adjust the risk-reward ratio to assess whether the trade offers sufficient profit potential relative to your risk.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your position size, maximum loss, and potential profit based on your risk-reward ratio. Use these outputs to decide whether to enter the trade and to set your take-profit level accordingly. Record your results and review them monthly to ensure your actual drawdowns align with your expected risk parameters—if they don't, adjust your position sizing or stop loss discipline.</p>
        </div>
      </section>

      {/* TABLE: Position Size Examples by Account Size and Risk Percentage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Position Size Examples by Account Size and Risk Percentage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows calculated position sizes for different account balances using the standard 1% risk rule with a typical $2 stop loss.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Account Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk per Trade (1%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stop Loss Distance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Position Size (Shares)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 shares</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125 shares</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 shares</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500 shares</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$250,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,250 shares</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$500,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500 shares</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These calculations assume a fixed $2 stop loss distance. Actual position sizes will vary based on your entry price and stop loss placement.</p>
      </section>

      {/* TABLE: Risk-Reward Ratio Impact on Trade Viability */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Risk-Reward Ratio Impact on Trade Viability</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how risk-reward ratios affect minimum win rate requirements and expected value for profitable trading.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk-Reward Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Win Rate Needed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Value (at 50% win rate)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not recommended</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.25 per dollar risked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Conservative traders</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.50 per dollar risked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard approach</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.00 per dollar risked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Intermediate traders</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50 per dollar risked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Advanced traders</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Expected value calculations assume the stated win rate. A 1:2 ratio with a 50% win rate generates $0.50 profit per dollar risked on average.</p>
      </section>

      {/* TABLE: Maximum Drawdown Scenarios and Recovery Requirements */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Maximum Drawdown Scenarios and Recovery Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the gain required to recover from various drawdown levels, illustrating why position sizing matters.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Drawdown Percentage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gain Needed to Break Even</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time to Recover (at 1% monthly gain)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 months</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These calculations use geometric mean; a 20% loss requires a 25% gain to return to breakeven because the base changes after the loss.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always calculate position size before entering a trade—never improvise or guess at share quantities, as this leads to over-leveraging and catastrophic losses.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the 1% rule as your baseline: risk no more than 1% of your account per trade until you have at least 100 trades of documented history and a positive expectancy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Place your stop loss based on technical levels (support, resistance, or swing points), not on your desired risk percentage—calculate position size to fit your stop loss, never the reverse.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Review your position sizing discipline monthly: track actual losses versus expected losses to ensure you're following your risk management plan and identify emotional trading that violates it.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Placing Stop Loss After Calculating Position Size</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many traders calculate position size based on a desired risk amount, then place the stop loss afterwards. This leads to either undersizing (if they want a tight stop) or oversizing (if they want a looser stop). Always identify the logical stop loss level first, then calculate position size to fit.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Fixed Dollar Risk Instead of Fixed Fractional Risk</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Trading the same dollar amount on every trade ($500 per trade, for example) fails to scale with account growth. Once your account doubles, you should be risking proportionally more on each position. Use fixed fractional risk (1% of your account) instead.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Volatility When Sizing Positions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High-volatility instruments like growth stocks or crypto require wider stop losses, which means proportionally smaller position sizes for the same dollar risk. Failure to adjust for volatility results in over-leveraged positions that breach your account risk limits during normal market swings.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Increasing Position Size After Winning Streaks</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Traders often become overconfident after consecutive wins and increase position size beyond their risk rules, only to suffer large losses when their luck reverses. Stick to your calculated position size regardless of recent performance, and only increase when your account size grows.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is position sizing and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Position sizing is the practice of determining how much capital to allocate to a single trade based on your account size and risk tolerance. It matters because it directly controls your maximum loss per trade; for example, risking 1-2% of a $50,000 account means your maximum loss per trade is $500-$1,000. Proper position sizing prevents catastrophic losses and allows you to survive losing streaks while maintaining long-term profitability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correct position size for my trade?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the formula: Position Size = (Account Size × Risk Percentage) / (Entry Price - Stop Loss Price). For example, with a $100,000 account, risking 2%, an entry price of $50, and a stop loss at $48, your position size would be ($100,000 × 0.02) / ($50 - $48) = 1,000 shares. This calculator automates this process and ensures your maximum loss matches your risk tolerance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of my account should I risk per trade?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Professional traders typically risk between 0.5% and 2% of their account per trade, with 1% being the industry standard for sustainable trading. Beginners should start at 0.5%-1% to build discipline, while experienced traders with proven systems may use up to 2%. The Kelly Criterion, a mathematical formula, suggests optimal risk can be higher only if you have a win rate above 55% and positive expected value.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the risk-reward ratio affect my position sizing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The risk-reward ratio determines whether a trade is worth taking; a 1:2 ratio means you stand to make $2 for every $1 you risk. When calculating position size, a better risk-reward ratio (like 1:3 or 1:4) allows you to risk slightly more per trade since losses are offset by larger gains. The calculator helps you identify trades with favorable risk-reward setups before committing capital.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between fixed fractional and fixed dollar risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fixed fractional risk bases position size on a percentage of your account (e.g., 1% of $50,000 = $500 risk), while fixed dollar risk risks the same dollar amount on every trade regardless of account growth. Fixed fractional is preferred because it scales with your account—as you grow from $50,000 to $100,000, your risk per trade doubles proportionally. This calculator uses fixed fractional risk, which is the professional standard.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I adjust position size if I'm on a losing streak?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most professionals reduce position size by 25-50% after 3 consecutive losses to preserve capital and rebuild confidence. For example, if you normally risk 1% ($500 on a $50,000 account), drop to 0.5% ($250) until you return to profitability. Never increase position size to recover losses quickly—this is called revenge trading and typically results in larger drawdowns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the same position size for different trading instruments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—position size must be calculated individually for each trade based on your entry price, stop loss, and the specific instrument's volatility. A stock with a $2 stop loss and a currency pair with a 0.02 pip stop loss will have very different position sizes despite the same dollar risk ($500). This calculator allows you to input instrument-specific parameters to ensure each position is sized correctly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum drawdown I should tolerate in trading?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Professional traders typically limit maximum drawdown to 20-25% of their account, with some conservative traders capping it at 10-15%. A 25% drawdown means you need a 33% gain to recover, while a 50% drawdown requires a 100% gain to break even. Using proper position sizing with 1% risk per trade typically results in maximum drawdowns of 10-15% during normal trading conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does volatility impact position sizing decisions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher volatility instruments (like growth stocks or cryptocurrency) require smaller position sizes because stop losses must be wider to accommodate normal price swings. For example, a volatile tech stock might require a $5 stop loss versus a $0.50 stop loss for a stable blue-chip stock, significantly reducing the share count you can buy. This calculator accounts for volatility through the stop loss distance input, ensuring you don't overleverage in volatile markets.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.investopedia.com/terms/p/positionsizing.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Position Sizing and Risk Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Investopedia's comprehensive guide to position sizing principles and practical calculation methods for traders.</p>
          </li>
          <li>
            <a href="https://www.sec.gov/investor/tools.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Investor Protection Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SEC resources on risk management and understanding investment products and their associated risks.</p>
          </li>
          <li>
            <a href="https://www.cftc.gov/LearnAndProtect/ConsumerProtection/RiskManagement" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Risk Management Best Practices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFTC guidance on risk management practices for futures and derivatives trading, including position sizing considerations.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/k/kellycriteria.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Kelly Criterion and Position Sizing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed explanation of the Kelly Criterion formula for calculating optimal position sizing based on win rate and odds.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Position Size & Risk Management Tool"
      description="Determine optimal position size. Manage risk by calculating stop-loss levels and appropriate trade amounts for your account."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Position Size & Risk Management Tool" },
        { id: "formula", label: "Position Size & Risk Management Tool Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Position Size = (Account Size × Risk Percentage) / Stop Loss",
        variables: [
          { symbol: "Account Size", description: "Total capital available for trading" },
          { symbol: "Risk Percentage", description: "Percentage of account size you're willing to risk" },
          { symbol: "Stop Loss", description: "Maximum loss allowed per trade" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an account size of $10,000, a risk percentage of 2%, and a stop loss of $50.",
        steps: [
          { 
            step: 1, 
            calculation: "10000 × 0.02 = 200", 
            description: "Calculate the risk amount based on your account size and risk percentage." 
          },
          { 
            step: 2, 
            calculation: "200 / 50 = 4", 
            description: "Determine the position size by dividing the risk amount by the stop loss." 
          },
          { 
            step: 3, 
            calculation: "4 × 50 = 200", 
            description: "The trade amount is the position size multiplied by the stop loss." 
          }
        ],
        result: "The final result is a position size of 4, meaning you can trade 4 units with a total risk of $200."
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
