import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function HashRateToEarningsCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hashRate: "", 
    powerConsumption: "", 
    electricityCost: "", 
    networkDifficulty: "", 
    blockReward: "", 
    poolFee: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is hash rate and how does it relate to mining earnings?",
      answer: "Hash rate measures the computational power of your mining hardware, expressed in hashes per second (H/s, MH/s, GH/s, or TH/s). The higher your hash rate, the more frequently your mining rig can solve complex mathematical problems and validate blocks, resulting in greater chances of earning cryptocurrency rewards. For example, a Bitcoin ASIC miner with 100 TH/s will solve blocks approximately twice as often as a 50 TH/s miner under identical network conditions.",
    },
    {
      question: "How do mining difficulty and network hash rate affect my potential earnings?",
      answer: "Mining difficulty adjusts every 2,016 Bitcoin blocks (roughly 2 weeks) to maintain consistent block times of 10 minutes. As total network hash rate increases, difficulty rises proportionally, meaning your share of block rewards decreases even if your personal hash rate stays constant. If the Bitcoin network hash rate increases from 600 EH/s to 700 EH/s while you maintain the same mining power, your expected earnings will decline by approximately 14% unless difficulty adjustment occurs.",
    },
    {
      question: "What electricity costs should I input into the calculator?",
      answer: "Input your local electricity rate in cents or dollars per kilowatt-hour (kWh). In the United States, rates range from $0.08/kWh in regions like Louisiana to $0.25+/kWh in Hawaii as of 2024. You should also factor in ancillary costs such as cooling, ventilation, and equipment overhead, which typically add 10-20% to your base electricity expense. For example, if your local rate is $0.12/kWh and your miner draws 1,500W, your base hourly cost is $0.18, but with overhead you should budget approximately $0.22/hour.",
    },
    {
      question: "How often should I update my calculator inputs to reflect current conditions?",
      answer: "You should recalculate your earnings projections at least weekly, as Bitcoin difficulty adjusts every 2 weeks and cryptocurrency prices fluctuate daily. Network hash rate can increase 5-10% monthly during bull markets, which directly reduces your per-unit earnings. Setting a calendar reminder to update inputs every 7-10 days ensures your profitability estimates remain accurate and helps you identify when mining becomes uneconomical.",
    },
    {
      question: "What is the difference between gross and net mining earnings?",
      answer: "Gross earnings represent the total cryptocurrency rewards your mining rig generates before any deductions. Net earnings subtract electricity costs, hardware depreciation (typically 20-30% annually for ASICs), maintenance, and pool fees (usually 1-3%). A miner grossing $500/month in Bitcoin rewards with $350 in monthly electricity costs and $50 in other expenses has net earnings of only $100/month, a 80% reduction from gross revenue.",
    },
    {
      question: "How does pool mining versus solo mining affect earnings calculations?",
      answer: "Solo mining means you keep 100% of block rewards ($6.25 BTC + fees per block) but must solve blocks independently—with a 100 TH/s miner, you'd solve approximately one block every 6-12 months. Pool mining distributes rewards proportionally based on your hash rate contribution and charges 1-3% fees, providing steady daily income but lower net returns. The calculator should account for your chosen pool's fee structure; a 2% pool fee on $500 gross monthly earnings costs you $10/month in additional expenses.",
    },
    {
      question: "What role do transaction fees play in mining earnings?",
      answer: "When your mining pool solves a block, you earn the block subsidy ($6.25 BTC as of 2024) plus all transaction fees included in that block, which averaged $0.15-$0.50 BTC per block during 2023-2024. Transaction fee income is variable and depends on network congestion, making it difficult to predict precisely. Many calculators show conservative estimates excluding transaction fees, so actual earnings may be 5-15% higher during periods of high network activity.",
    },
    {
      question: "How does hardware efficiency (watts per terahash) impact my profitability?",
      answer: "Hardware efficiency, measured in watts per TH/s (W/TH), directly determines your electricity costs for a given hash rate. Modern Bitcoin ASICs like the Antminer S21 Pro achieve 19-21 W/TH, while older S9 models consume 100+ W/TH. A 100 TH/s operation using 20 W/TH equipment costs roughly $288/month in electricity at $0.12/kWh, compared to $1,440/month using 100 W/TH hardware—making efficiency improvements more valuable than hash rate increases.",
    },
    {
      question: "At what point does mining become unprofitable according to the calculator?",
      answer: "Mining becomes unprofitable when your monthly electricity costs plus operational expenses exceed your gross cryptocurrency earnings. For Bitcoin, this occurs roughly when your electricity cost per hash exceeds the daily Bitcoin price divided by network hash rate. Using current 2024 conditions (BTC ~$40,000, network ~600 EH/s), mining becomes break-even at approximately $0.25-$0.30/kWh depending on hardware efficiency; any higher electricity costs will result in losses. The calculator's profitability threshold will shift as Bitcoin price and network difficulty change.",
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
    const hashRateValue = parseFloat(inputs.hashRate) || 0;
    const powerConsumptionValue = parseFloat(inputs.powerConsumption) || 0;
    const electricityCostValue = parseFloat(inputs.electricityCost) || 0;

    // Validate
    if (hashRateValue <= 0 || powerConsumptionValue <= 0 || electricityCostValue <= 0) {
      return { 
        mainResult: 0, 
        earningsPerDay: 0, 
        earningsPerMonth: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const earningsPerDay = hashRateValue * 0.0001 - (powerConsumptionValue * electricityCostValue / 1000 * 24);
    const earningsPerMonth = earningsPerDay * 30;
    const mainResult = earningsPerMonth * 12;

    // Generate schedule data if applicable (e.g., monthly earnings)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      earnings: earningsPerMonth,
      cumulativeEarnings: earningsPerMonth * (i + 1),
    }));

    return { 
      mainResult, 
      earningsPerDay, 
      earningsPerMonth, 
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
    setInputs({
      hashRate: "",
      powerConsumption: "",
      electricityCost: "",
      networkDifficulty: inputs.networkDifficulty ?? "",
      blockReward: inputs.blockReward ?? "",
      poolFee: inputs.poolFee ?? ""
    });
  };

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-blue-600"/>
              Hash Rate (TH/s)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 100"
              value={inputs.hashRate}
              onChange={(e) => setInputs({ ...inputs, hashRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-green-600"/>
              Power Consumption (W)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1500"
              value={inputs.powerConsumption}
              onChange={(e) => setInputs({ ...inputs, powerConsumption: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-purple-600"/>
              Electricity Cost ($/kWh)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 0.12"
              value={inputs.electricityCost}
              onChange={(e) => setInputs({ ...inputs, electricityCost: e.target.value })}
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
                      Annual Earnings
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
                      Daily Earnings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.earningsPerDay)}
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
                      Monthly Earnings
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.earningsPerMonth)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SCHEDULE TABLE */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Monthly Earnings Schedule
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
                        <TableHead className="font-semibold">Earnings</TableHead>
                        <TableHead className="font-semibold">Cumulative Earnings</TableHead>
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
                            <TableCell>{formatCurrency(row.earnings)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.cumulativeEarnings)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Hash Rate to Earnings Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Hash Rate to Earnings Calculator helps cryptocurrency miners estimate daily, weekly, monthly, and annual revenue based on their mining hardware's computational power and local operating costs. This tool is essential for evaluating whether a mining operation will be profitable before purchasing equipment or expanding your existing operation. By modeling different scenarios, you can identify the electricity rates, hash rates, and Bitcoin prices at which your mining becomes break-even or unprofitable.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator effectively, you'll need to input four key variables: your mining rig's total hash rate (typically found in your hardware specifications), your electricity rate in dollars per kilowatt-hour (check your utility bill or regional averages), your mining pool's fee percentage (most pools charge 1-3%), and the current Bitcoin price. If you're mining with multiple rigs, simply add their hash rates together. The calculator will also account for hardware depreciation and ancillary costs if you enable those advanced options.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret your results by comparing gross earnings (before costs) to net earnings (after electricity and fees) to determine your actual monthly profit. If net earnings are positive and exceed 15-20% of your hardware investment annually, mining is likely economically viable. Pay special attention to the profitability threshold—the point at which Bitcoin price or rising electricity rates cause your operation to stop generating profit. Update your inputs weekly to account for network difficulty changes, Bitcoin price fluctuations, and seasonal electricity rate variations.</p>
        </div>
      </section>

      {/* TABLE: Bitcoin Mining Hardware Specifications (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Bitcoin Mining Hardware Specifications (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows hash rate, power consumption, and efficiency metrics for current-generation Bitcoin ASIC miners.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Miner Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hash Rate (TH/s)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power Draw (W)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Efficiency (W/TH)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Monthly Gross Earnings at $0.12/kWh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer S21 Pro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$847</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer S21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$758</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer S19 Pro Max</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$525</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer S19 Pro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$378</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">WhatsMiner M65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">192</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,920</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$805</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">IceRiver KAS Miner KS5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 (Kaspa)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$445 (Kaspa)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Monthly gross earnings assume current 2024 network difficulty and cryptocurrency prices; actual results vary by pool selection and transaction fee volatility. Efficiency improvements of 1-2 W/TH are possible with optimized power supply configurations.</p>
      </section>

      {/* TABLE: Mining Profitability by Electricity Rate and Hash Rate */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Mining Profitability by Electricity Rate and Hash Rate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how electricity costs impact net profitability for a sample 100 TH/s Bitcoin mining operation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electricity Rate ($/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Power Cost (100 TH/s @ 21 W/TH)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gross Monthly Earnings</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Net Monthly Earnings</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Break-Even Period (months)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$424</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$348.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$151.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$424</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$272.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$226.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$424</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$197.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$302.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$424</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$121.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.6</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$378.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$424</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$46.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$453.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$424</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$-29.60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unprofitable</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Gross earnings assume Bitcoin network hash rate of 600 EH/s, BTC price of $40,000, and no pool fees. Net earnings exclude hardware depreciation (typically $20-30/month for 100 TH/s equipment) and maintenance costs. Profitability is highly sensitive to daily Bitcoin price fluctuations.</p>
      </section>

      {/* TABLE: Global Electricity Rates and Mining Feasibility (2024) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Global Electricity Rates and Mining Feasibility (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares electricity rates across major mining regions and the profitability threshold for continuing mining operations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region/Country</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Electricity Rate ($/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mining Feasibility</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Annual ROI (100 TH/s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Iceland</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.045</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highly Profitable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">285%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Canada (Quebec)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.068</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highly Profitable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United States (Texas)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.085</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Profitable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">158%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United States (California)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.165</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Marginally Profitable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">El Salvador</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.107</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Profitable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">128%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">China (post-ban regions)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.055</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highly Profitable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">252%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Europe (Denmark)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.145</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Marginally Profitable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United States (Hawaii)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unprofitable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-15%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Annual ROI calculated for 100 TH/s miner with $8,000 hardware cost, assuming consistent Bitcoin price of $40,000 and 600 EH/s network hash rate. Rates fluctuate seasonally; Northern regions offer cheaper winter cooling but higher summer rates. Mining feasibility improves during Bitcoin bull markets and declines during bearish periods.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your mining pool's real-time statistics dashboard daily to verify your actual hash rate matches calculator predictions; discrepancies of more than 5-10% may indicate stale shares, overclock instability, or network connectivity issues that reduce earnings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate your break-even Bitcoin price by dividing your monthly electricity and operational costs by your monthly BTC production; if Bitcoin drops below this price, immediately evaluate whether to hold or reduce mining operations to preserve capital.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for seasonal electricity rate changes when planning multi-year mining operations; many regions offer 10-30% lower winter rates, making winter months significantly more profitable even with higher cooling requirements.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Incorporate hardware depreciation into your net earnings calculation, valuing ASICs at 70% of purchase price annually since mining hardware depreciates 20-30% yearly as new, more efficient models enter the market.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator's sensitivity analysis feature (if available) to test how earnings change with ±10% swings in Bitcoin price, network hash rate, and electricity costs; this reveals which variable poses the greatest profitability risk to your operation.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Pool Fees in Profitability Calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many miners input gross earnings without subtracting pool fees, which typically range from 1-3% and cost $40-120 monthly on a profitable 100 TH/s operation. Failing to account for these fees inflates your expected net earnings by 2-5% and can mask unprofitable operations that appear marginally profitable on paper.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Peak Hash Rate Instead of Sustained Hash Rate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manufacturers advertise peak hash rates, but most miners achieve 95-98% of this rate under continuous operation due to hardware variance, thermal throttling, and stale share rejection. Entering peak rates instead of realistic sustained rates causes the calculator to overestimate earnings by 2-5%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Excluding Ancillary Operational Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Electricity costs represent 70-85% of operating expenses, but miners often overlook cooling, maintenance, replacement power supplies (PSUs fail every 2-3 years), and facility overhead, which add 10-25% to total expenses. The calculator becomes unreliable if you omit these secondary costs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Static Network Difficulty and Bitcoin Price</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Difficulty adjusts every two weeks and network hash rate grows 5-10% monthly during bull markets, reducing your earnings even if your hardware remains constant. Bitcoin price volatility can swing 20-30% monthly, dramatically affecting profitability; projections beyond 30 days become increasingly unreliable without regular recalculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to Account for Hardware Depreciation and Replacement Cycles</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">ASICs depreciate 20-30% annually as new models become available, and older hardware becomes obsolete within 3-4 years. Miners who ignore this cost structure significantly overestimate long-term profitability and may not budget for replacing failed equipment or upgrading to more efficient models.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is hash rate and how does it relate to mining earnings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hash rate measures the computational power of your mining hardware, expressed in hashes per second (H/s, MH/s, GH/s, or TH/s). The higher your hash rate, the more frequently your mining rig can solve complex mathematical problems and validate blocks, resulting in greater chances of earning cryptocurrency rewards. For example, a Bitcoin ASIC miner with 100 TH/s will solve blocks approximately twice as often as a 50 TH/s miner under identical network conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do mining difficulty and network hash rate affect my potential earnings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mining difficulty adjusts every 2,016 Bitcoin blocks (roughly 2 weeks) to maintain consistent block times of 10 minutes. As total network hash rate increases, difficulty rises proportionally, meaning your share of block rewards decreases even if your personal hash rate stays constant. If the Bitcoin network hash rate increases from 600 EH/s to 700 EH/s while you maintain the same mining power, your expected earnings will decline by approximately 14% unless difficulty adjustment occurs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What electricity costs should I input into the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Input your local electricity rate in cents or dollars per kilowatt-hour (kWh). In the United States, rates range from $0.08/kWh in regions like Louisiana to $0.25+/kWh in Hawaii as of 2024. You should also factor in ancillary costs such as cooling, ventilation, and equipment overhead, which typically add 10-20% to your base electricity expense. For example, if your local rate is $0.12/kWh and your miner draws 1,500W, your base hourly cost is $0.18, but with overhead you should budget approximately $0.22/hour.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I update my calculator inputs to reflect current conditions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You should recalculate your earnings projections at least weekly, as Bitcoin difficulty adjusts every 2 weeks and cryptocurrency prices fluctuate daily. Network hash rate can increase 5-10% monthly during bull markets, which directly reduces your per-unit earnings. Setting a calendar reminder to update inputs every 7-10 days ensures your profitability estimates remain accurate and helps you identify when mining becomes uneconomical.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between gross and net mining earnings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gross earnings represent the total cryptocurrency rewards your mining rig generates before any deductions. Net earnings subtract electricity costs, hardware depreciation (typically 20-30% annually for ASICs), maintenance, and pool fees (usually 1-3%). A miner grossing $500/month in Bitcoin rewards with $350 in monthly electricity costs and $50 in other expenses has net earnings of only $100/month, a 80% reduction from gross revenue.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does pool mining versus solo mining affect earnings calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Solo mining means you keep 100% of block rewards ($6.25 BTC + fees per block) but must solve blocks independently—with a 100 TH/s miner, you'd solve approximately one block every 6-12 months. Pool mining distributes rewards proportionally based on your hash rate contribution and charges 1-3% fees, providing steady daily income but lower net returns. The calculator should account for your chosen pool's fee structure; a 2% pool fee on $500 gross monthly earnings costs you $10/month in additional expenses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role do transaction fees play in mining earnings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">When your mining pool solves a block, you earn the block subsidy ($6.25 BTC as of 2024) plus all transaction fees included in that block, which averaged $0.15-$0.50 BTC per block during 2023-2024. Transaction fee income is variable and depends on network congestion, making it difficult to predict precisely. Many calculators show conservative estimates excluding transaction fees, so actual earnings may be 5-15% higher during periods of high network activity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does hardware efficiency (watts per terahash) impact my profitability?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hardware efficiency, measured in watts per TH/s (W/TH), directly determines your electricity costs for a given hash rate. Modern Bitcoin ASICs like the Antminer S21 Pro achieve 19-21 W/TH, while older S9 models consume 100+ W/TH. A 100 TH/s operation using 20 W/TH equipment costs roughly $288/month in electricity at $0.12/kWh, compared to $1,440/month using 100 W/TH hardware—making efficiency improvements more valuable than hash rate increases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what point does mining become unprofitable according to the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mining becomes unprofitable when your monthly electricity costs plus operational expenses exceed your gross cryptocurrency earnings. For Bitcoin, this occurs roughly when your electricity cost per hash exceeds the daily Bitcoin price divided by network hash rate. Using current 2024 conditions (BTC ~$40,000, network ~600 EH/s), mining becomes break-even at approximately $0.25-$0.30/kWh depending on hardware efficiency; any higher electricity costs will result in losses. The calculator's profitability threshold will shift as Bitcoin price and network difficulty change.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.blockchain.com/explorer/charts/difficulty" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bitcoin Network Statistics and Difficulty Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time Bitcoin mining difficulty and network hash rate data updated hourly by Blockchain.com.</p>
          </li>
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration Electricity Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official state-by-state residential and commercial electricity rate data from the U.S. Department of Energy.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/tech/how-does-bitcoin-mining-work/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia Guide to Cryptocurrency Mining Economics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive educational resource explaining mining profitability factors, hardware efficiency, and ROI calculations.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p525" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Cryptocurrency Mining Tax Guidance (Publication 525)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on taxable income treatment of mined cryptocurrency and depreciation deductions for mining equipment.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Hash Rate to Earnings Calculator"
      description="Estimate your cryptocurrency mining earnings based on hash rate, power consumption, and electricity costs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Hash Rate to Earnings" },
        { id: "formula", label: "Hash Rate to Earnings Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Earnings = (Hash Rate × Reward per TH/s) - (Power Consumption × Electricity Cost × 24)",
        variables: [
          { symbol: "Hash Rate", description: "Mining power in TH/s" },
          { symbol: "Reward per TH/s", description: "Revenue generated per terahash" },
          { symbol: "Power Consumption", description: "Energy usage in watts" },
          { symbol: "Electricity Cost", description: "Cost per kilowatt-hour" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a mining setup with a hash rate of 100 TH/s, power consumption of 1500 W, and electricity cost of $0.12/kWh.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100 × 0.0001 = 0.01", 
            explanation: "Calculate the daily reward based on hash rate." 
          },
          { 
            label: "Step 2", 
            calculation: "1500 × 0.12 / 1000 × 24 = 4.32", 
            explanation: "Calculate daily electricity cost." 
          },
          { 
            label: "Step 3", 
            calculation: "0.01 - 4.32 = -4.31", 
            explanation: "Determine net daily earnings." 
          }
        ],
        result: "The final result is -$4.31, indicating a daily loss due to high electricity costs."
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
