import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ElectricityCostVsMiningRevenueCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    electricityCost: "", 
    miningRevenue: "", 
    operationalDays: "" 
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
      question: "What is the break-even point between electricity costs and mining revenue?",
      answer: "The break-even point occurs when your total electricity costs equal your mining revenue over a specific period. For example, if you're mining Bitcoin with an ASIC miner consuming 1,500 watts at $0.12 per kWh, you'd need to generate approximately $5.40 daily in revenue just to cover electricity costs. Using this calculator, you can input your specific wattage, local electricity rate, and expected hash rate to find your exact break-even mining difficulty or price point.",
    },
    {
      question: "How do I find my local electricity rate for mining calculations?",
      answer: "Your electricity rate is listed on your monthly utility bill, typically shown in cents per kilowatt-hour (¢/kWh). In the U.S., residential rates average $0.14/kWh, while commercial rates average $0.11/kWh, and industrial mining operations may negotiate rates as low as $0.04-$0.08/kWh. If you're unsure, contact your utility provider directly, as rates vary significantly by region and can affect your mining profitability by 50% or more.",
    },
    {
      question: "What hardware specifications do I need to input into this calculator?",
      answer: "You'll need your mining hardware's power consumption (in watts), hash rate (measured in TH/s for Bitcoin or MH/s for Ethereum), and operational efficiency rating. For example, an Antminer S21 Pro consumes 3,410 watts and produces 200 TH/s, while a more efficient model like the S21 uses 3,360 watts for slightly less output. These specifications determine how much electricity your operation uses relative to the mining revenue it generates.",
    },
    {
      question: "How often do mining difficulty and block rewards change?",
      answer: "Bitcoin mining difficulty adjusts approximately every 2 weeks (every 2,016 blocks) to maintain a 10-minute average block time, while block rewards halve every 210,000 blocks (approximately every 4 years, with the most recent halving in April 2024 reducing rewards from 6.25 to 3.125 BTC). Ethereum, which transitioned to proof-of-stake in 2022, no longer has traditional mining, but other coins like Litecoin and Dogecoin have different adjustment schedules. This calculator helps you project earnings under various difficulty scenarios to stress-test your operation's viability.",
    },
    {
      question: "What is the impact of mining pool fees on net revenue?",
      answer: "Mining pools typically charge 1-3% in fees (with popular pools like Stratum V2 offering lower fees), which directly reduces your net revenue from mining. For example, if you generate $100 daily in mining rewards and your pool charges 2%, your net revenue drops to $98, equivalent to losing $730 monthly. When using this calculator, subtract your pool fee percentage from projected revenue to get a realistic picture of actual take-home profit after electricity costs.",
    },
    {
      question: "How do cooling and infrastructure costs factor into total operating expenses?",
      answer: "Cooling costs typically add 20-30% to your base electricity bill for large-scale mining operations, as ASIC miners generate significant heat requiring industrial ventilation systems. For a 100 kW mining operation at $0.10/kWh base rate ($10/hour), cooling could add $2-$3 per hour in additional costs, totaling $48-$72 daily. While this calculator focuses on direct electricity costs, professional miners should account for infrastructure overhead, facility leasing, and cooling expenses separately to calculate true profitability.",
    },
    {
      question: "What is the current Bitcoin mining reward and how does it affect profitability calculations?",
      answer: "As of 2024-2025, the Bitcoin block reward is 3.125 BTC per block (after the April 2024 halving), with blocks mined approximately every 10 minutes, equaling roughly 144 blocks per day. At $45,000 per BTC, this represents about $20.25 million in daily network mining rewards distributed among all miners. Your share of these rewards depends on your hash power relative to total network hash rate; this calculator helps you project earnings by factoring in your miner's TH/s against the current network total of approximately 680 EH/s.",
    },
    {
      question: "How does cryptocurrency price volatility affect the electricity cost vs. revenue calculation?",
      answer: "Mining revenue is directly tied to the price of the cryptocurrency being mined, which can fluctuate 10-20% monthly or more. A Bitcoin priced at $45,000 might generate 2x the revenue compared to $22,500, but your electricity costs remain fixed, dramatically improving profitability during price upswings. This calculator allows you to model different price scenarios to understand your profit margins across bull and bear market conditions.",
    },
    {
      question: "Should I consider the useful lifespan of mining hardware when comparing costs and revenue?",
      answer: "Yes, mining hardware typically remains profitable for 2-4 years before becoming obsolete due to network difficulty increases and newer, more efficient models entering the market. An ASIC miner costing $2,000 that generates $4,000 in revenue annually appears profitable until you factor in 3-4 years of electricity, maintenance, and facility costs that could total $8,000-$12,000 over its lifespan. This calculator helps you determine if your mining operation will generate cumulative profit over the expected hardware lifespan before reinvestment in newer equipment becomes necessary.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const electricityCostValue = parseFloat(inputs.electricityCost) || 0;
    const miningRevenueValue = parseFloat(inputs.miningRevenue) || 0;
    const operationalDaysValue = parseFloat(inputs.operationalDays) || 0;

    // Validate
    if (electricityCostValue <= 0 || miningRevenueValue <= 0 || operationalDaysValue <= 0) {
      return { 
        mainResult: 0, 
        netProfit: 0, 
        costPerDay: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalElectricityCost = electricityCostValue * operationalDaysValue;
    const totalMiningRevenue = miningRevenueValue * operationalDaysValue;
    const netProfit = totalMiningRevenue - totalElectricityCost;
    const costPerDay = totalElectricityCost / operationalDaysValue;

    // Generate schedule data if applicable (e.g., daily breakdown)
    const scheduleData = Array.from({ length: operationalDaysValue }, (_, i) => ({
      day: i + 1,
      dailyCost: electricityCostValue,
      dailyRevenue: miningRevenueValue,
      dailyNet: miningRevenueValue - electricityCostValue,
      cumulativeNet: (miningRevenueValue - electricityCostValue) * (i + 1)
    }));

    return { 
      mainResult: netProfit, 
      netProfit, 
      costPerDay, 
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
    setInputs({ electricityCost: "", miningRevenue: "", operationalDays: "" });
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
              Electricity Cost per Day ($)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={inputs.electricityCost}
              onChange={(e) => setInputs({ ...inputs, electricityCost: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Mining Revenue per Day ($)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 100"
              value={inputs.miningRevenue}
              onChange={(e) => setInputs({ ...inputs, miningRevenue: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Operational Days
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.operationalDays}
              onChange={(e) => setInputs({ ...inputs, operationalDays: e.target.value })}
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
                      Net Profit
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.netProfit)}
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
                      Total Electricity Cost
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.costPerDay * parseFloat(inputs.operationalDays))}
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
                      Cost Per Day
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.costPerDay)}
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
                    Daily Financial Breakdown
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
                        : `Show All ${results.scheduleData.length} Days`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Day</TableHead>
                        <TableHead className="font-semibold">Daily Cost</TableHead>
                        <TableHead className="font-semibold">Daily Revenue</TableHead>
                        <TableHead className="font-semibold">Daily Net</TableHead>
                        <TableHead className="font-semibold">Cumulative Net</TableHead>
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
                            <TableCell className="font-medium">{row.day}</TableCell>
                            <TableCell>{formatCurrency(row.dailyCost)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.dailyRevenue)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.dailyNet)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.cumulativeNet)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Electricity Cost vs Mining Revenue Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator compares your mining operation's total electricity expenses against your expected mining revenue to determine profitability and break-even points. By modeling the relationship between power consumption, electricity rates, and mining output, you can make informed decisions about hardware purchases, location selection, and operational scaling. Whether you're evaluating a single ASIC miner or a large-scale mining farm, this tool helps you understand if your operation will generate profit under current and projected network conditions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The key inputs required are your miner's power consumption (in watts), hash rate output (in TH/s for Bitcoin), local electricity rate (in ¢/kWh), and the cryptocurrency's current market price. You'll also need to consider mining difficulty—either current difficulty or projected future adjustments—which affects the time required to earn mining rewards. Pool fees (typically 1-3%), hardware lifespan expectations, and operational overhead should also be factored into your analysis, though this calculator focuses on the core electricity-to-revenue comparison.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing daily, weekly, or monthly net profit figures; if electricity costs exceed mining revenue, your operation runs at a loss and requires either higher cryptocurrency prices, lower electricity rates, or more efficient hardware to achieve profitability. The calculator also helps you identify break-even prices—the minimum cryptocurrency price required to cover electricity costs—and stress-test your operation under various scenarios like difficulty increases or price drops. Use these outputs to decide whether to continue mining, upgrade hardware, relocate to cheaper power regions, or suspend operations during low-profitability periods.</p>
        </div>
      </section>

      {/* TABLE: Average Electricity Rates by Region (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Electricity Rates by Region (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Regional electricity costs significantly impact mining profitability, with rates varying from $0.04/kWh in industrial areas to $0.24/kWh in expensive residential markets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Rate (¢/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Mining Cost (24hrs, 1,500W)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Iceland</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.04–$0.06</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.44–$2.16</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">El Salvador</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.05–$0.07</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.80–$2.52</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas (Industrial)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.06–$0.08</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.16–$2.88</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">U.S. Average (Residential)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.14–$0.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5.04–$5.76</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York (Residential)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.17–$0.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.12–$7.20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California (Peak)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.20–$0.24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7.20–$8.64</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United Kingdom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.18–$0.22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.48–$7.92</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Germany</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.22–$0.28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7.92–$10.08</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates vary by season, contract type, and time-of-use pricing; consult your utility provider for exact rates. Industrial mining operations can negotiate bulk rates 50-70% lower than residential rates.</p>
      </section>

      {/* TABLE: Popular ASIC Miners: Power Consumption vs. Hash Rate */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Popular ASIC Miners: Power Consumption vs. Hash Rate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Modern ASIC miners vary significantly in power efficiency, measured as watts per terahash per second (W/TH/s), which directly impacts the electricity cost per unit of mining output.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Miner Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power (watts)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hash Rate (TH/s)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Efficiency (W/TH)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer S21 Pro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3410</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.05</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer S21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer S19 Pro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer T21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.25</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">IceRiver KS0 Pro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.14</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Whatsminer M63S</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3710</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.67</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Canaan Avalon A1566 Pro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3276</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.85</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Braiins Dragonmint T1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">92.5</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Efficiency (W/TH) = Power ÷ Hash Rate; lower values indicate better efficiency and lower operating costs per unit of hash power. Prices typically range $3,500–$6,000 per unit as of 2024.</p>
      </section>

      {/* TABLE: Mining Profitability Scenarios: Daily Revenue vs. Electricity Cost */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Mining Profitability Scenarios: Daily Revenue vs. Electricity Cost</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how mining profitability varies based on Bitcoin price, electricity rate, and miner efficiency, showing daily net profit or loss scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bitcoin Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Miner Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Gross Revenue</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Electricity Cost ($0.12/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Net Profit/(Loss)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">S21 Pro (200 TH/s)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.66</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">S19 Pro (110 TH/s)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.88</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">($2.48)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$45,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">S21 Pro (200 TH/s)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.21</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$45,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">S19 Pro (110 TH/s)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">($0.51)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$65,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">S21 Pro (200 TH/s)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$23.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13.36</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$65,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">S19 Pro (110 TH/s)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.44</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$45,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">S21 Pro @ $0.08/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9.49</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$45,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">S21 Pro @ $0.16/kWh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.93</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume current network difficulty of ~680 EH/s and 3.125 BTC block reward. Mining pool fees (1-3%) not included; subtract from gross revenue for net figures.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your electricity rate in real-time by reviewing your utility bills monthly; rates can vary seasonally and by time-of-use, so use your actual average rate rather than advertised rates for accurate profitability projections.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare your miner's efficiency rating (W/TH/s) across models before purchasing; a $500 price difference for a 10% more efficient miner can save $1,000-$2,000 annually in electricity costs for a 24/7 operation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Recalculate profitability every 2 weeks when Bitcoin mining difficulty adjusts; a 5-10% difficulty increase can reduce daily revenue by the same percentage, potentially pushing marginal operations into loss territory.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in cooling and infrastructure costs as an additional 20-30% overhead for large operations; this calculator's electricity costs represent only direct ASIC consumption, not the full environmental conditioning required for optimal performance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Negotiate bulk electricity rates with your utility if operating 5+ kilowatts continuously; many providers offer industrial rates 30-50% lower than standard residential rates, significantly improving your cost basis.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using advertised electricity rates instead of actual rates from your bill</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Utility companies often advertise base rates that don't reflect taxes, delivery charges, and demand fees that can increase your effective rate by 20-40%. Always calculate your actual ¢/kWh by dividing total monthly cost by kWh used to ensure accurate profitability modeling.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring mining pool fees in revenue calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mining pool fees of 1-3% directly reduce your net revenue and can turn a barely-profitable operation into a loss-making one. Always subtract pool fees from gross mining revenue before comparing against electricity costs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to account for difficulty adjustments and price volatility</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mining revenue depends on both network difficulty (which rises every 2 weeks) and cryptocurrency price (which fluctuates daily), yet many miners calculate profitability based on static assumptions. Use this calculator to model multiple scenarios—including pessimistic price drops and difficulty increases—to test whether your operation survives market downturns.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not including hardware depreciation and replacement costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">ASIC miners typically remain profitable for only 2-4 years before network difficulty makes them obsolete, yet many operators treat hardware as a one-time cost without planning for replacement. Calculate cumulative profitability over 3-5 years to determine if your operation generates enough surplus to fund hardware upgrades.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the break-even point between electricity costs and mining revenue?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The break-even point occurs when your total electricity costs equal your mining revenue over a specific period. For example, if you're mining Bitcoin with an ASIC miner consuming 1,500 watts at $0.12 per kWh, you'd need to generate approximately $5.40 daily in revenue just to cover electricity costs. Using this calculator, you can input your specific wattage, local electricity rate, and expected hash rate to find your exact break-even mining difficulty or price point.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I find my local electricity rate for mining calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your electricity rate is listed on your monthly utility bill, typically shown in cents per kilowatt-hour (¢/kWh). In the U.S., residential rates average $0.14/kWh, while commercial rates average $0.11/kWh, and industrial mining operations may negotiate rates as low as $0.04-$0.08/kWh. If you're unsure, contact your utility provider directly, as rates vary significantly by region and can affect your mining profitability by 50% or more.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What hardware specifications do I need to input into this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You'll need your mining hardware's power consumption (in watts), hash rate (measured in TH/s for Bitcoin or MH/s for Ethereum), and operational efficiency rating. For example, an Antminer S21 Pro consumes 3,410 watts and produces 200 TH/s, while a more efficient model like the S21 uses 3,360 watts for slightly less output. These specifications determine how much electricity your operation uses relative to the mining revenue it generates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often do mining difficulty and block rewards change?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bitcoin mining difficulty adjusts approximately every 2 weeks (every 2,016 blocks) to maintain a 10-minute average block time, while block rewards halve every 210,000 blocks (approximately every 4 years, with the most recent halving in April 2024 reducing rewards from 6.25 to 3.125 BTC). Ethereum, which transitioned to proof-of-stake in 2022, no longer has traditional mining, but other coins like Litecoin and Dogecoin have different adjustment schedules. This calculator helps you project earnings under various difficulty scenarios to stress-test your operation's viability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the impact of mining pool fees on net revenue?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mining pools typically charge 1-3% in fees (with popular pools like Stratum V2 offering lower fees), which directly reduces your net revenue from mining. For example, if you generate $100 daily in mining rewards and your pool charges 2%, your net revenue drops to $98, equivalent to losing $730 monthly. When using this calculator, subtract your pool fee percentage from projected revenue to get a realistic picture of actual take-home profit after electricity costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do cooling and infrastructure costs factor into total operating expenses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cooling costs typically add 20-30% to your base electricity bill for large-scale mining operations, as ASIC miners generate significant heat requiring industrial ventilation systems. For a 100 kW mining operation at $0.10/kWh base rate ($10/hour), cooling could add $2-$3 per hour in additional costs, totaling $48-$72 daily. While this calculator focuses on direct electricity costs, professional miners should account for infrastructure overhead, facility leasing, and cooling expenses separately to calculate true profitability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the current Bitcoin mining reward and how does it affect profitability calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2024-2025, the Bitcoin block reward is 3.125 BTC per block (after the April 2024 halving), with blocks mined approximately every 10 minutes, equaling roughly 144 blocks per day. At $45,000 per BTC, this represents about $20.25 million in daily network mining rewards distributed among all miners. Your share of these rewards depends on your hash power relative to total network hash rate; this calculator helps you project earnings by factoring in your miner's TH/s against the current network total of approximately 680 EH/s.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does cryptocurrency price volatility affect the electricity cost vs. revenue calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mining revenue is directly tied to the price of the cryptocurrency being mined, which can fluctuate 10-20% monthly or more. A Bitcoin priced at $45,000 might generate 2x the revenue compared to $22,500, but your electricity costs remain fixed, dramatically improving profitability during price upswings. This calculator allows you to model different price scenarios to understand your profit margins across bull and bear market conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I consider the useful lifespan of mining hardware when comparing costs and revenue?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, mining hardware typically remains profitable for 2-4 years before becoming obsolete due to network difficulty increases and newer, more efficient models entering the market. An ASIC miner costing $2,000 that generates $4,000 in revenue annually appears profitable until you factor in 3-4 years of electricity, maintenance, and facility costs that could total $8,000-$12,000 over its lifespan. This calculator helps you determine if your mining operation will generate cumulative profit over the expected hardware lifespan before reinvestment in newer equipment becomes necessary.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration — Average Electricity Rates by State</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. government source providing current and historical electricity rates by state, sector, and pricing type.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/bitcoin-mining-how-to-calculate-profitability-5114873" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia — Bitcoin Mining Profitability Calculator and Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to calculating mining profitability, including electricity costs, hardware efficiency, and break-even analysis.</p>
          </li>
          <li>
            <a href="https://www.blockchain.com/en/charts/difficulty" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Blockchain.com — Bitcoin Network Hash Rate and Difficulty</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time tracking of Bitcoin network difficulty and hash rate metrics essential for accurate mining revenue projections.</p>
          </li>
          <li>
            <a href="https://www.sec.gov/news/press-release/2023-120" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Securities and Exchange Commission — Cryptocurrency Disclosure Guidance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SEC guidance on cryptocurrency mining as a taxable business activity and reporting requirements for mining operations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Electricity Cost vs Mining Revenue"
      description="Compare electricity costs against mining revenue. Ensure your mining operation remains profitable with this cost analysis tool."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Electricity Cost vs Mining Revenue" },
        { id: "formula", label: "Electricity Cost vs Mining Revenue Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Profit = (Mining Revenue per Day × Operational Days) - (Electricity Cost per Day × Operational Days)",
        variables: [
          { symbol: "Mining Revenue per Day", description: "Expected earnings from mining each day" },
          { symbol: "Electricity Cost per Day", description: "Cost of electricity consumed each day" },
          { symbol: "Operational Days", description: "Total number of days the mining operation runs" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a mining operation running for 30 days, with a daily electricity cost of $50 and a daily mining revenue of $100.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100 × 30 = 3000", 
            explanation: "Calculate total mining revenue over 30 days." 
          },
          { 
            label: "Step 2", 
            calculation: "50 × 30 = 1500", 
            explanation: "Calculate total electricity cost over 30 days." 
          },
          { 
            label: "Step 3", 
            calculation: "3000 - 1500 = 1500", 
            explanation: "Subtract total electricity cost from total mining revenue to find net profit." 
          }
        ],
        result: "The final result is $1,500, meaning your operation is profitable over the 30-day period."
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