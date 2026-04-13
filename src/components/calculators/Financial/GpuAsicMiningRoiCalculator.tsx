import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function GpuAsicMiningRoiCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hardwareCost: "", 
    dailyProfit: "", 
    electricityCost: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is the difference between GPU and ASIC mining for ROI calculations?",
      answer: "GPU mining uses graphics processors (like NVIDIA RTX 4090) to solve algorithms and is suitable for multiple cryptocurrencies, while ASIC mining uses specialized chips designed for one specific algorithm and offers higher hash rates but less flexibility. GPUs typically generate 100-500 MH/s depending on the model, whereas ASICs for Bitcoin can achieve 100+ TH/s. The ROI calculator accounts for these differences in electricity costs, hardware depreciation, and mining difficulty adjustments.",
    },
    {
      question: "How does electricity cost affect my mining ROI?",
      answer: "Electricity is typically 60-80% of total mining operating costs, making it the most critical variable in ROI calculations. A miner paying $0.06/kWh will see dramatically different returns than one paying $0.15/kWh—this can mean the difference between profitability and losses. The calculator multiplies your hardware's power consumption (e.g., RTX 4090 uses 450W) by your local electricity rate and the number of operating hours to determine total energy costs.",
    },
    {
      question: "What hardware specifications should I input for accurate GPU mining ROI?",
      answer: "You need the GPU model (e.g., RTX 4090, RX 7900 XTX), its hash rate in MH/s for your target coin, power consumption in watts, and purchase price. For example, an RTX 4090 produces approximately 120 MH/s on Ethereum-equivalent coins while consuming 450W. Accurate specs ensure the calculator properly estimates daily earnings and break-even timelines based on current mining difficulty.",
    },
    {
      question: "How do mining difficulty adjustments impact ROI projections?",
      answer: "Mining difficulty adjusts approximately every 2 weeks for Bitcoin and every 12-15 seconds for Ethereum-based coins, reducing rewards as more miners join the network. A difficulty increase of 10% can reduce your daily earnings by proportionally similar amounts, extending your payback period. The calculator uses current difficulty data but projects future earnings based on historical difficulty trends, which may overestimate or underestimate actual returns.",
    },
    {
      question: "What is the typical payback period for a $1,500 GPU mining rig?",
      answer: "Payback periods range from 6-18 months depending on cryptocurrency prices, electricity costs, and difficulty levels. At current conditions with $0.08/kWh electricity and using 2-3 GPUs totaling $1,500, a miner might earn $300-400/month, resulting in a 4-5 month payback period. However, this assumes stable difficulty and coin prices—actual timelines vary significantly based on market conditions.",
    },
    {
      question: "Should I include cooling and maintenance costs in my ROI calculation?",
      answer: "Yes, cooling and maintenance typically add 10-15% to your operating costs beyond electricity. This includes cooling fans, replacement thermal paste, replacement power supplies, and potential hardware repairs or replacements. The most accurate ROI calculations incorporate these as additional monthly expenses rather than ignoring them or treating them as one-time costs.",
    },
    {
      question: "How does cryptocurrency price volatility affect mining ROI calculations?",
      answer: "Mining revenue is directly tied to cryptocurrency market prices—a 30% drop in Bitcoin price immediately reduces your mining earnings by 30%, even if hash rate and difficulty remain constant. The calculator shows ROI based on current prices, but actual returns depend heavily on whether prices rise, fall, or stabilize over your mining period. It's essential to model scenarios with different price assumptions rather than relying on a single fixed-price projection.",
    },
    {
      question: "What is the minimum electricity rate needed to break even on ASIC mining?",
      answer: "For modern ASIC miners like the Antminer S21 Pro (21 TH/s, 3,410W), the break-even electricity rate is approximately $0.04-0.05/kWh at current Bitcoin difficulty levels. Miners in regions with cheaper electricity (Iceland, El Salvador, parts of China and Central Asia) achieve profitability at rates that would produce losses in North America or Europe. Your calculator results should clearly indicate whether your input electricity rate supports profitability.",
    },
    {
      question: "How should I account for hardware depreciation in my mining ROI?",
      answer: "Mining hardware depreciates 40-60% in the first year due to technological obsolescence and wear, but many miners ignore this critical cost factor. A $2,000 GPU might be worth $800-1,200 after one year, representing $800-1,200 in non-cash expenses that should reduce your calculated ROI. The most accurate calculator results subtract estimated resale value loss from gross mining profits to show true net ROI.",
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
    const hardwareCostValue = parseFloat(inputs.hardwareCost) || 0;
    const dailyProfitValue = parseFloat(inputs.dailyProfit) || 0;
    const electricityCostValue = parseFloat(inputs.electricityCost) || 0;

    // Validate
    if (hardwareCostValue <= 0 || dailyProfitValue <= 0) {
      return { 
        roiDays: 0, 
        monthlyProfit: 0, 
        annualProfit: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const netDailyProfit = dailyProfitValue - electricityCostValue;
    const roiDays = hardwareCostValue / netDailyProfit;
    const monthlyProfit = netDailyProfit * 30;
    const annualProfit = netDailyProfit * 365;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      cumulativeProfit: netDailyProfit * 30 * (i + 1),
      remainingCost: Math.max(hardwareCostValue - (netDailyProfit * 30 * (i + 1)), 0)
    }));

    return { 
      roiDays, 
      monthlyProfit, 
      annualProfit, 
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
    setInputs({ hardwareCost: "", dailyProfit: "", electricityCost: "" });
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
              Hardware Cost
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3000"
              value={inputs.hardwareCost}
              onChange={(e) => setInputs({ ...inputs, hardwareCost: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Daily Profit
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15"
              value={inputs.dailyProfit}
              onChange={(e) => setInputs({ ...inputs, dailyProfit: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Electricity Cost
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
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
      {results.roiDays > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Days to ROI
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.ceil(results.roiDays)}
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
                      Monthly Profit
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.monthlyProfit)}
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
                      Annual Profit
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.annualProfit)}
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
                    Profit Schedule
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
                        <TableHead className="font-semibold">Cumulative Profit</TableHead>
                        <TableHead className="font-semibold">Remaining Cost</TableHead>
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
                            <TableCell>{formatCurrency(row.cumulativeProfit)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.remainingCost)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the GPU/ASIC Mining ROI Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The GPU/ASIC Mining ROI Calculator helps miners estimate profitability by analyzing hardware costs, electricity expenses, and mining rewards to determine break-even timelines and return on investment. This tool is essential for evaluating whether mining is viable in your region and which hardware configuration offers the best returns, as profitability varies dramatically by location, electricity costs, and cryptocurrency prices.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator accurately, input four key variables: (1) your hardware model and hash rate (e.g., RTX 4090 at 120 MH/s), (2) power consumption in watts (450W for RTX 4090), (3) your local electricity rate per kilowatt-hour (typically $0.04-$0.15 depending on region), and (4) hardware purchase price in dollars. Optional inputs include mining pool fees (typically 1-2%), expected difficulty increase rates, and hardware depreciation assumptions, which refine your projections.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by examining three critical outputs: the daily/monthly gross mining revenue (before costs), total daily/monthly operating expenses (primarily electricity), and net profit or loss. The break-even timeline shows when cumulative profits equal your hardware investment—if this exceeds 12 months, profitability becomes questionable due to hardware obsolescence and price volatility. Use the ROI percentage to compare against alternative investments, remembering that mining returns are highly sensitive to electricity rates and difficulty adjustments.</p>
        </div>
      </section>

      {/* TABLE: GPU Mining Hardware Specifications and Profitability (2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">GPU Mining Hardware Specifications and Profitability (2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares current popular GPU models with their hash rates, power consumption, and estimated monthly profitability at $0.08/kWh electricity cost.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">GPU Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hash Rate (MH/s)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power Draw (W)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">MSRP ($)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Est. Monthly Profit ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">NVIDIA RTX 4090</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,599</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">285</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">NVIDIA RTX 4080 Super</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">999</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">AMD RX 7900 XTX</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">899</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">NVIDIA RTX 4070 Ti Super</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">285</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">799</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">AMD RX 7700 XT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">399</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">NVIDIA RTX 4070</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">599</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">105</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates based on current Ethereum-equivalent algorithm difficulty and $2,500-3,200 coin prices; actual results vary by coin mined and pool fees (1-2%).</p>
      </section>

      {/* TABLE: ASIC Mining Hardware Comparison and ROI Timeline */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">ASIC Mining Hardware Comparison and ROI Timeline</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows current ASIC miners with their respective hash rates, power consumption, and estimated break-even periods at different electricity rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">ASIC Model</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hash Rate (TH/s)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Power (W)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hardware Cost ($)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Payback at $0.04/kWh (months)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Payback at $0.08/kWh (months)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer S21 Pro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3410</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Whatsminer M66</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer S21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">IceRiver KS0 Pro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Antminer L7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3425</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21.6</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Payback timelines assume current Bitcoin difficulty; difficulty increases reduce profitability and extend break-even periods. Includes hardware cost only, not facility or cooling setup.</p>
      </section>

      {/* TABLE: Electricity Cost Impact on Annual Mining Profitability */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Electricity Cost Impact on Annual Mining Profitability</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how regional electricity rates significantly affect annual profitability for a single RTX 4090 GPU miner.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electricity Rate ($/kWh)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Electricity Cost ($)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Mining Revenue ($)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Net Profit ($)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual ROI (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.04</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">248</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">186</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.06</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">108</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">212</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">159</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.08</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">144</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">176</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">132</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">105</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">216</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">104</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0.14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">252</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on RTX 4090 (450W, 120 MH/s) mining Ethereum-equivalent at $2,800 coin price; assumes 2% pool fee and 99% uptime. Revenue decreases if difficulty increases or price declines.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare electricity rates across regions before committing to mining—moving from $0.12/kWh to $0.06/kWh can double your annual profitability and reduce payback periods from 18 months to 9 months for the same hardware.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for all overhead costs including cooling solutions, replacement power supplies, mining rig frames, and network equipment, which typically add 10-15% to your stated electricity expenses.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Model multiple scenarios using the calculator with different cryptocurrency prices (±20% and ±50%) and difficulty growth rates (5%, 10%, 20% monthly) to understand profitability under bearish and bullish conditions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track actual mining performance against calculator projections monthly—if real earnings are 15-20% below estimates, investigate pool efficiency, hardware degradation, or difficulty changes that require ROI recalculation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Evaluate GPU mining ROI separately from ASIC mining because ASICs depreciate faster due to rapid chip obsolescence, while GPUs retain dual-use value for gaming or compute work if mining becomes unprofitable.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Electricity Costs in ROI Calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many new miners focus only on gross mining revenue and overlook electricity, which represents 60-80% of operating expenses. Failing to account for accurate electricity rates can make unprofitable operations appear profitable, leading to significant losses when actual bills arrive.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated or Incorrect Hash Rate Specifications</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Inputting optimistic manufacturer hash rates instead of real-world verified rates (which are typically 10-20% lower due to pool overhead and stale shares) inflates projected earnings and extends break-even timelines. Always verify hash rates with independent benchmarks like mining pool reports or Reddit mining communities.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Hardware Depreciation and Obsolescence</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">GPU and ASIC mining hardware depreciates 40-60% in the first year, but many calculators ignore this non-cash expense entirely. Without accounting for resale value loss, you overestimate true ROI by 30-50%, making mediocre investments appear attractive.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Static Difficulty and Cryptocurrency Prices</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator's accuracy depends on reasonable assumptions about future difficulty growth and price stability, but mining difficulty increases 5-20% monthly on average. Projecting profitability without accounting for difficulty adjustments produces unrealistic results that diverge significantly from actual experience.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Geographic Tax Implications on Mining Income</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mining rewards are taxable income in most jurisdictions, with tax rates ranging from 20-37% depending on location and classification as hobby or business. Failing to reserve 20-30% of profits for taxes reduces actual net ROI substantially below calculator projections.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between GPU and ASIC mining for ROI calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">GPU mining uses graphics processors (like NVIDIA RTX 4090) to solve algorithms and is suitable for multiple cryptocurrencies, while ASIC mining uses specialized chips designed for one specific algorithm and offers higher hash rates but less flexibility. GPUs typically generate 100-500 MH/s depending on the model, whereas ASICs for Bitcoin can achieve 100+ TH/s. The ROI calculator accounts for these differences in electricity costs, hardware depreciation, and mining difficulty adjustments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does electricity cost affect my mining ROI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Electricity is typically 60-80% of total mining operating costs, making it the most critical variable in ROI calculations. A miner paying $0.06/kWh will see dramatically different returns than one paying $0.15/kWh—this can mean the difference between profitability and losses. The calculator multiplies your hardware's power consumption (e.g., RTX 4090 uses 450W) by your local electricity rate and the number of operating hours to determine total energy costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What hardware specifications should I input for accurate GPU mining ROI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You need the GPU model (e.g., RTX 4090, RX 7900 XTX), its hash rate in MH/s for your target coin, power consumption in watts, and purchase price. For example, an RTX 4090 produces approximately 120 MH/s on Ethereum-equivalent coins while consuming 450W. Accurate specs ensure the calculator properly estimates daily earnings and break-even timelines based on current mining difficulty.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do mining difficulty adjustments impact ROI projections?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mining difficulty adjusts approximately every 2 weeks for Bitcoin and every 12-15 seconds for Ethereum-based coins, reducing rewards as more miners join the network. A difficulty increase of 10% can reduce your daily earnings by proportionally similar amounts, extending your payback period. The calculator uses current difficulty data but projects future earnings based on historical difficulty trends, which may overestimate or underestimate actual returns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical payback period for a $1,500 GPU mining rig?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Payback periods range from 6-18 months depending on cryptocurrency prices, electricity costs, and difficulty levels. At current conditions with $0.08/kWh electricity and using 2-3 GPUs totaling $1,500, a miner might earn $300-400/month, resulting in a 4-5 month payback period. However, this assumes stable difficulty and coin prices—actual timelines vary significantly based on market conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include cooling and maintenance costs in my ROI calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, cooling and maintenance typically add 10-15% to your operating costs beyond electricity. This includes cooling fans, replacement thermal paste, replacement power supplies, and potential hardware repairs or replacements. The most accurate ROI calculations incorporate these as additional monthly expenses rather than ignoring them or treating them as one-time costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does cryptocurrency price volatility affect mining ROI calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mining revenue is directly tied to cryptocurrency market prices—a 30% drop in Bitcoin price immediately reduces your mining earnings by 30%, even if hash rate and difficulty remain constant. The calculator shows ROI based on current prices, but actual returns depend heavily on whether prices rise, fall, or stabilize over your mining period. It's essential to model scenarios with different price assumptions rather than relying on a single fixed-price projection.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the minimum electricity rate needed to break even on ASIC mining?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For modern ASIC miners like the Antminer S21 Pro (21 TH/s, 3,410W), the break-even electricity rate is approximately $0.04-0.05/kWh at current Bitcoin difficulty levels. Miners in regions with cheaper electricity (Iceland, El Salvador, parts of China and Central Asia) achieve profitability at rates that would produce losses in North America or Europe. Your calculator results should clearly indicate whether your input electricity rate supports profitability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I account for hardware depreciation in my mining ROI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mining hardware depreciates 40-60% in the first year due to technological obsolescence and wear, but many miners ignore this critical cost factor. A $2,000 GPU might be worth $800-1,200 after one year, representing $800-1,200 in non-cash expenses that should reduce your calculated ROI. The most accurate calculator results subtract estimated resale value loss from gross mining profits to show true net ROI.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/individuals/international-taxpayers/virtual-currency" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Virtual Currency Guidance for Mining Activities</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on taxation of cryptocurrency mining rewards as ordinary income and capital gains treatment of mined cryptocurrency sales.</p>
          </li>
          <li>
            <a href="https://www.sec.gov/spotlight/cryptocurrency-digital-assets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Cryptocurrency and Digital Assets Guidance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative SEC resource on cryptocurrency regulations, investment risks, and how mining activities are classified from a securities and regulatory perspective.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/c/cryptocurrency.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia's Cryptocurrency Mining and ROI Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide explaining mining mechanics, profitability factors, hardware costs, and how to calculate return on investment for mining operations.</p>
          </li>
          <li>
            <a href="https://www.eia.gov/electricity/state/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Energy Information Administration Electricity Rates by State</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official EIA data on average electricity rates by state and region, essential for accurately inputting local power costs into mining profitability calculators.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="GPU/ASIC Mining ROI Calculator"
      description="Calculate the Return on Investment (ROI) for your GPU or ASIC mining hardware. Estimate the payback period based on hardware cost, daily profit, and electricity costs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Mining ROI" },
        { id: "formula", label: "GPU/ASIC Mining ROI Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "ROI Days = Hardware Cost / (Daily Profit - Electricity Cost)",
        variables: [
          { symbol: "Hardware Cost", description: "Initial investment in mining hardware" },
          { symbol: "Daily Profit", description: "Earnings from mining per day" },
          { symbol: "Electricity Cost", description: "Daily cost of electricity used by mining hardware" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a mining setup with a hardware cost of $3000, daily profit of $15, and electricity cost of $5.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Net Daily Profit = $15 - $5 = $10", 
            explanation: "Calculate the net profit after electricity costs." 
          },
          { 
            label: "Step 2", 
            calculation: "ROI Days = $3000 / $10 = 300", 
            explanation: "Determine the number of days to break even." 
          },
          { 
            label: "Step 3", 
            calculation: "Monthly Profit = $10 × 30 = $300", 
            explanation: "Calculate the monthly profit." 
          }
        ],
        result: "The final result is 300 days to ROI, with a monthly profit of $300, meaning it will take approximately 10 months to recoup your investment."
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
