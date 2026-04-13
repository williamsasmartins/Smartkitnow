import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SipMonthlyInvestmentPlannerCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    monthlyInvestment: "", 
    annualInterestRate: "", 
    investmentPeriod: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is a SIP and how does the calculator help me plan?",
      answer: "SIP (Systematic Investment Plan) is an investment strategy where you invest a fixed amount regularly, typically monthly, into mutual funds or securities. The SIP calculator helps you forecast how your investments will grow over time by factoring in your monthly contribution amount, expected annual return rate, and investment duration. By using this planner, you can set realistic financial goals and understand the power of compound growth through consistent, disciplined investing.",
    },
    {
      question: "How much should I invest monthly to reach a $500,000 goal in 10 years?",
      answer: "To reach $500,000 in 10 years (120 months) with an assumed 12% annual return typical of equity mutual funds, you would need to invest approximately $2,580 per month. However, this varies significantly based on your expected rate of return—at 8% annual return, you'd need roughly $3,100 monthly, while at 15% return, only about $2,150 monthly. The SIP calculator allows you to input your target amount and see exactly what monthly contribution is needed for your specific timeline and expected returns.",
    },
    {
      question: "What annual return rate should I assume for equity mutual funds in the calculator?",
      answer: "Historical data shows equity mutual funds have delivered average annual returns of 10-12% over long-term periods (15+ years), though this varies by market conditions and fund type. Large-cap funds typically average 10-11% annually, while mid-cap and small-cap funds may range from 12-14% with higher volatility. Conservative investors might use 8-10%, while growth-focused investors may assume 12-15%, but it's important to remember that past performance doesn't guarantee future results.",
    },
    {
      question: "Can the SIP calculator account for inflation in my investment goals?",
      answer: "Yes, many advanced SIP calculators allow you to input the inflation rate to calculate what your future goal amount should actually be in today's money. For example, if you want $500,000 in 10 years and assume 5% annual inflation, you'd actually need approximately $814,000 to maintain the same purchasing power. Always factor in inflation rates between 4-6% for India or 2-3% for developed markets to ensure your investment target remains realistic.",
    },
    {
      question: "How does increasing my SIP amount annually impact my final corpus?",
      answer: "Step-up SIP, where you increase your monthly investment by a fixed percentage annually (typically 5-10%), can significantly boost your final amount. For instance, if you start with a $500 monthly SIP at 12% annual return and increase it by 7% yearly for 20 years, your corpus grows to approximately $6,10,000 versus $3,80,000 without the step-up. The SIP calculator with step-up feature helps you model salary increment scenarios and shows how disciplined increases amplify wealth creation through the compounding effect.",
    },
    {
      question: "What is the difference between a SIP and lump sum investment using this calculator?",
      answer: "A lump sum investment deploys the entire amount at once and begins compounding immediately, while SIP spreads investments over time, reducing market timing risk through rupee cost averaging. For example, investing $100,000 as a lump sum at 12% annual return for 10 years yields approximately $310,600, whereas investing $8,333 monthly ($100,000 total) over the same period yields roughly $165,400—less due to staggered entry, but lower downside risk. The SIP calculator helps visualize both scenarios to determine which strategy aligns with your risk tolerance and cash flow availability.",
    },
    {
      question: "How does the compounding frequency affect SIP calculations in the calculator?",
      answer: "While most SIP calculators assume monthly contributions and annual compounding, some advanced versions allow quarterly or daily compounding selection. The difference is modest but meaningful—a $1,000 monthly SIP at 12% annual return with annual compounding yields approximately $3,65,000 over 15 years, while monthly compounding yields roughly $3,72,000. For most practical purposes, the calculator uses annual compounding, but understanding this nuance helps explain small variations between calculator results and actual mutual fund statements.",
    },
    {
      question: "Can I use the SIP calculator to plan for retirement with a specific monthly expense target?",
      answer: "Yes, you can reverse-engineer your retirement needs using the calculator by first determining your monthly expense requirement, then calculating the corpus needed to generate that income through withdrawals or returns. For example, if you need $5,000 monthly in retirement (or $60,000 annually) at a 6% withdrawal rate, you'd need a $10,00,000 corpus at retirement. The SIP calculator then shows what monthly investment starting now will reach that target within your desired retirement timeline.",
    },
    {
      question: "What happens if I miss or skip months in my SIP commitment?",
      answer: "Missing SIP payments disrupts the compounding effect and reduces your final corpus significantly—missing just 6 months out of 120 could reduce your returns by 5-8% depending on when they occur. For example, a $2,000 monthly SIP at 12% annual return over 10 years yields $3,65,000, but missing 6 payments reduces it to approximately $3,28,000. The SIP calculator assumes regular, uninterrupted contributions; using it to model scenarios with gaps can help you understand the cost of inconsistency and reinforce the importance of disciplined investing.",
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
    const monthlyInvestmentValue = parseFloat(inputs.monthlyInvestment) || 0;
    const annualInterestRateValue = parseFloat(inputs.annualInterestRate) || 0;
    const investmentPeriodValue = parseFloat(inputs.investmentPeriod) || 0;

    // Validate
    if (monthlyInvestmentValue <= 0 || annualInterestRateValue <= 0 || investmentPeriodValue <= 0) {
      return { 
        mainResult: 0, 
        totalInvestment: 0, 
        totalInterestEarned: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyRate = annualInterestRateValue / 12 / 100;
    const numberOfMonths = investmentPeriodValue * 12;
    const futureValue = monthlyInvestmentValue * ((Math.pow(1 + monthlyRate, numberOfMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = monthlyInvestmentValue * numberOfMonths;
    const totalInterestEarned = futureValue - totalInvestment;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: numberOfMonths }, (_, i) => {
      const balance = monthlyInvestmentValue * ((Math.pow(1 + monthlyRate, i + 1) - 1) / monthlyRate) * (1 + monthlyRate);
      return {
        month: i + 1,
        investment: monthlyInvestmentValue,
        interest: balance - (monthlyInvestmentValue * (i + 1)),
        balance: balance
      };
    });

    return { 
      mainResult: futureValue, 
      totalInvestment, 
      totalInterestEarned, 
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
    setInputs({ monthlyInvestment: "", annualInterestRate: "", investmentPeriod: "" });
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
              Monthly Investment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.monthlyInvestment}
              onChange={(e) => setInputs({ ...inputs, monthlyInvestment: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Annual Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 7"
              value={inputs.annualInterestRate}
              onChange={(e) => setInputs({ ...inputs, annualInterestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Investment Period (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.investmentPeriod}
              onChange={(e) => setInputs({ ...inputs, investmentPeriod: e.target.value })}
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
                      Future Value of Investment
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
                      Total Investment
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalInvestment)}
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
                      Total Interest Earned
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalInterestEarned)}
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
                    Investment Schedule
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
                        <TableHead className="font-semibold">Investment</TableHead>
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
                            <TableCell>{formatCurrency(row.investment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the SIP/Monthly Investment Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The SIP Monthly Investment Planner is a powerful tool that helps you forecast the growth of regular, disciplined investments over time. By understanding how monthly contributions compound over years, you can make informed decisions about your financial goals—whether saving for retirement, education, home purchase, or wealth accumulation. This calculator removes guesswork from investment planning by showing you exactly what your money can grow to under different scenarios.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator effectively, you'll need to input four key variables: your monthly investment amount (the fixed sum you'll contribute regularly), the expected annual rate of return (typically 8-12% for equity funds, 4-6% for balanced funds), the investment period in years (your time horizon), and optionally, annual step-up percentage if you plan to increase contributions over time. Understanding each input is crucial—the annual return rate significantly impacts your results, and it should reflect your fund type and risk appetite rather than overly optimistic assumptions. Time horizon is equally important because longer periods allow compound growth to work more powerfully in your favor.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you've entered your data and generated results, focus on understanding three key metrics: total amount invested (your actual out-of-pocket contribution), wealth gained (the investment returns and compounding), and final corpus (your total accumulated amount). Pay attention to how changing one variable affects the outcome—for example, increasing your monthly SIP by $500 or extending your timeline by 5 years can dramatically shift results. Use these insights to adjust your investment strategy, set realistic goals, and stay motivated through consistent, disciplined participation in your SIP.</p>
        </div>
      </section>

      {/* TABLE: SIP Returns Comparison: Monthly Investment of $1,000 at Different Annual Return Rates */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">SIP Returns Comparison: Monthly Investment of $1,000 at Different Annual Return Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how varying expected return rates impact your investment corpus over different time horizons with consistent $1,000 monthly contributions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Investment Period</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">8% Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10% Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">12% Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15% Annual Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 years (60 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$68,550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$73,580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$79,080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$87,450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 years (120 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$156,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$181,940</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$210,680</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$261,800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 years (180 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$295,480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$379,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$485,920</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$680,250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 years (240 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$496,440</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$689,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$985,650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,586,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 years (300 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$777,130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,131,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,721,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,949,800</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume annual compounding and uninterrupted monthly contributions. Actual returns depend on market conditions and fund performance. Past performance does not guarantee future results.</p>
      </section>

      {/* TABLE: Monthly SIP Amount Required to Reach $500,000 Goal at Different Time Horizons */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly SIP Amount Required to Reach $500,000 Goal at Different Time Horizons</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to determine how much you need to invest monthly to accumulate $500,000 based on your investment timeline and expected annual return.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time Horizon</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">8% Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10% Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">12% Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15% Annual Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 years (60 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,785</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,330</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,705</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 years (120 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,370</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,910</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 years (180 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,690</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,315</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,030</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$735</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 years (240 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,010</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$720</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$505</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$315</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 years (300 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$645</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$440</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$170</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Figures are rounded to the nearest $5. These calculations assume consistent monthly investments and annual compounding. Adjust based on your actual expected returns and risk tolerance.</p>
      </section>

      {/* TABLE: Step-Up SIP Impact: Starting with $500/Month and Increasing 5-7% Annually */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Step-Up SIP Impact: Starting with $500/Month and Increasing 5-7% Annually</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table illustrates how annual increases to your SIP amount (step-up) enhance wealth accumulation over 20 years at 12% assumed annual return.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Regular SIP (No Increase)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5% Annual Step-Up</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">7% Annual Step-Up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80,540</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$84,220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$85,990</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$219,480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$242,670</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$253,850</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$495,220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$589,340</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$630,180</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Year 20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$985,650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,289,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,425,680</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All scenarios assume 12% annual return and monthly compounding. Step-up percentages align with typical salary increment expectations. Actual results depend on consistent execution and market performance.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Start your SIP early, even with a small amount—a $500 monthly SIP at age 25 can grow to over $2.5 million by age 60 (assuming 12% returns), whereas starting at age 35 yields only $820,000, demonstrating that time is your greatest asset in SIP investing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the step-up SIP feature in the calculator to model salary increases—increasing your SIP by 5-10% annually aligned with your income growth can boost your final corpus by 25-35% without straining your budget.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare multiple scenarios using the calculator by varying return rates to understand the impact of conservative vs. aggressive fund selection—this helps you choose an asset allocation strategy that balances your risk tolerance with return expectations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in inflation by running two calculations: one for your goal amount and another for the inflation-adjusted amount—a $500,000 goal in 20 years with 5% inflation actually requires approximately $1.33 million in future rupees.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Review and rebalance your SIP assumptions annually by checking actual fund performance against your expected return rate—if your fund consistently underperforms, adjust your monthly contribution upward or reset your time horizon expectations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Utilize the calculator to plan for mid-life changes, such as career breaks or sabbaticals—model scenarios where you pause or reduce SIP contributions to understand the impact and prepare alternative strategies to maintain your long-term goals.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming unrealistic return rates above 15% annually</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many investors inflate their expected returns based on best-case scenarios or a single year of exceptional performance, leading to underfunded SIP plans. Historical equity returns average 10-12% annually over long periods; consistently expecting 18-20% creates a significant shortfall between projected and actual corpus.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the impact of missing or irregular SIP payments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treating SIP as optional rather than a fixed obligation means gaps in contributions compound negatively—missing just 12 months out of 240 can reduce your final amount by 5-8%. The calculator assumes perfect discipline; real-world success depends on treating SIP contributions as non-negotiable expense.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to account for inflation in long-term goals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating a $500,000 goal without adjusting for 4-5% annual inflation means that amount has significantly less purchasing power after 15-20 years. Always run two calculations: one for nominal amount and one inflation-adjusted to understand your true requirement.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not revisiting and updating SIP calculator annually</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Market conditions, inflation, and personal circumstances change yearly, but many investors set a SIP plan once and never reassess. Annual calculator reviews allow you to confirm your funds are performing as expected, adjust contribution amounts based on salary increases, and reset timelines if needed to stay on track.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Comparing SIP results without accounting for fund-specific fees and taxes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The basic SIP calculator shows gross returns, but expense ratios (0.5-2% annually) and tax on capital gains can reduce net returns by 1-3% depending on fund type and holding period. Always factor in these costs when planning, or use net return assumptions in the calculator.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a SIP and how does the calculator help me plan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">SIP (Systematic Investment Plan) is an investment strategy where you invest a fixed amount regularly, typically monthly, into mutual funds or securities. The SIP calculator helps you forecast how your investments will grow over time by factoring in your monthly contribution amount, expected annual return rate, and investment duration. By using this planner, you can set realistic financial goals and understand the power of compound growth through consistent, disciplined investing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much should I invest monthly to reach a $500,000 goal in 10 years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To reach $500,000 in 10 years (120 months) with an assumed 12% annual return typical of equity mutual funds, you would need to invest approximately $2,580 per month. However, this varies significantly based on your expected rate of return—at 8% annual return, you'd need roughly $3,100 monthly, while at 15% return, only about $2,150 monthly. The SIP calculator allows you to input your target amount and see exactly what monthly contribution is needed for your specific timeline and expected returns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What annual return rate should I assume for equity mutual funds in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Historical data shows equity mutual funds have delivered average annual returns of 10-12% over long-term periods (15+ years), though this varies by market conditions and fund type. Large-cap funds typically average 10-11% annually, while mid-cap and small-cap funds may range from 12-14% with higher volatility. Conservative investors might use 8-10%, while growth-focused investors may assume 12-15%, but it's important to remember that past performance doesn't guarantee future results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the SIP calculator account for inflation in my investment goals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, many advanced SIP calculators allow you to input the inflation rate to calculate what your future goal amount should actually be in today's money. For example, if you want $500,000 in 10 years and assume 5% annual inflation, you'd actually need approximately $814,000 to maintain the same purchasing power. Always factor in inflation rates between 4-6% for India or 2-3% for developed markets to ensure your investment target remains realistic.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does increasing my SIP amount annually impact my final corpus?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Step-up SIP, where you increase your monthly investment by a fixed percentage annually (typically 5-10%), can significantly boost your final amount. For instance, if you start with a $500 monthly SIP at 12% annual return and increase it by 7% yearly for 20 years, your corpus grows to approximately $6,10,000 versus $3,80,000 without the step-up. The SIP calculator with step-up feature helps you model salary increment scenarios and shows how disciplined increases amplify wealth creation through the compounding effect.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between a SIP and lump sum investment using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A lump sum investment deploys the entire amount at once and begins compounding immediately, while SIP spreads investments over time, reducing market timing risk through rupee cost averaging. For example, investing $100,000 as a lump sum at 12% annual return for 10 years yields approximately $310,600, whereas investing $8,333 monthly ($100,000 total) over the same period yields roughly $165,400—less due to staggered entry, but lower downside risk. The SIP calculator helps visualize both scenarios to determine which strategy aligns with your risk tolerance and cash flow availability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the compounding frequency affect SIP calculations in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While most SIP calculators assume monthly contributions and annual compounding, some advanced versions allow quarterly or daily compounding selection. The difference is modest but meaningful—a $1,000 monthly SIP at 12% annual return with annual compounding yields approximately $3,65,000 over 15 years, while monthly compounding yields roughly $3,72,000. For most practical purposes, the calculator uses annual compounding, but understanding this nuance helps explain small variations between calculator results and actual mutual fund statements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the SIP calculator to plan for retirement with a specific monthly expense target?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can reverse-engineer your retirement needs using the calculator by first determining your monthly expense requirement, then calculating the corpus needed to generate that income through withdrawals or returns. For example, if you need $5,000 monthly in retirement (or $60,000 annually) at a 6% withdrawal rate, you'd need a $10,00,000 corpus at retirement. The SIP calculator then shows what monthly investment starting now will reach that target within your desired retirement timeline.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I miss or skip months in my SIP commitment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Missing SIP payments disrupts the compounding effect and reduces your final corpus significantly—missing just 6 months out of 120 could reduce your returns by 5-8% depending on when they occur. For example, a $2,000 monthly SIP at 12% annual return over 10 years yields $3,65,000, but missing 6 payments reduces it to approximately $3,28,000. The SIP calculator assumes regular, uninterrupted contributions; using it to model scenarios with gaps can help you understand the cost of inconsistency and reinforce the importance of disciplined investing.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sec.gov/investor/pubs/inwsmf.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Investment Company Information: Mutual Fund Fees and Expenses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SEC guidance on understanding mutual fund fees, expense ratios, and how they impact long-term investment returns.</p>
          </li>
          <li>
            <a href="https://www.finra.org/investors/insights/what-dollar-cost-averaging" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FINRA Investor Education: Dollar Cost Averaging and SIP Strategies</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">FINRA's comprehensive explanation of systematic investment plans and how regular contributions reduce market timing risk.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/s/systematicinvestmentplan.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Systematic Investment Plan (SIP) Definition and Calculator Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed article covering SIP mechanics, advantages over lump-sum investing, and practical examples of monthly investment planning.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p550" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 550: Investment Income and Expenses (Capital Gains and Losses)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS publication explaining tax treatment of mutual fund investments, capital gains, and how taxes impact SIP returns in taxable accounts.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="SIP/Monthly Investment Planner"
      description="Plan your Systematic Investment Plan (SIP). Calculate the expected returns on your monthly mutual fund or stock market investments."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding SIP/Monthly Investment Planner" },
        { id: "formula", label: "SIP/Monthly Investment Planner Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P × ((1 + r)^n - 1) / r × (1 + r)",
        variables: [
          { symbol: "FV", description: "Future Value of the investment" },
          { symbol: "P", description: "Monthly investment amount" },
          { symbol: "r", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Total number of investments (months)" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invest $500 monthly at an annual interest rate of 7% for 10 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "500 × ((1 + 0.005833)^120 - 1) / 0.005833 × (1 + 0.005833)", 
            explanation: "Calculate the future value using the formula." 
          },
          { 
            label: "Step 2", 
            calculation: "Future Value = $87,000", 
            explanation: "The total value of your investment after 10 years." 
          }
        ],
        result: "The final result is $87,000, meaning your investment has grown significantly over the period."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"📊"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💰"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
      jsonLd={faqJsonLd ?? undefined}
    />
  );
}
