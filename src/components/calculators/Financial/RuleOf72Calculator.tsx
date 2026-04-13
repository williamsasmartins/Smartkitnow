import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function RuleOf72Calculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    interestRate: "", 
    initialInvestment: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is the Rule of 72 and how does this calculator use it?",
      answer: "The Rule of 72 is a simple formula that estimates how many years it takes for an investment to double at a given annual interest rate. The calculator divides 72 by your annual return rate to instantly show doubling time. For example, at a 6% annual return, your money doubles in approximately 12 years (72 ÷ 6 = 12). This rule works best for returns between 3% and 10%.",
    },
    {
      question: "How accurate is the Rule of 72 Calculator?",
      answer: "The Rule of 72 is remarkably accurate for moderate interest rates between 3% and 10%, typically within 0.1 to 0.2 years of the true doubling time. At 5% annual returns, the rule estimates 14.4 years, while the actual time is 14.21 years. However, accuracy decreases significantly at very high rates (above 15%) or very low rates (below 2%).",
    },
    {
      question: "Can I use the Rule of 72 for investment accounts earning less than 3%?",
      answer: "While technically possible, the Rule of 72 becomes less accurate below 3% returns. A savings account earning 0.5% APY would theoretically take 144 years to double according to the rule, but the actual time is 138.6 years. For rates below 3%, using the more precise Rule of 69.3 or an exact compound interest calculation provides better accuracy.",
    },
    {
      question: "What average annual returns should I assume for stocks and bonds?",
      answer: "Historically, the S&P 500 has averaged approximately 10% annual returns since 1926 (including dividends), suggesting stocks double every 7.2 years. Investment-grade bonds have averaged around 5-6% annually, implying a doubling period of 12-14.4 years. However, past performance doesn't guarantee future results, and actual returns vary year to year.",
    },
    {
      question: "How does inflation affect the Rule of 72 doubling time calculation?",
      answer: "The Rule of 72 typically calculates nominal doubling time (before adjusting for inflation), but you should compare your rate against inflation for real purchasing power growth. If your investment returns 7% annually but inflation is 3%, your real return is approximately 4%, meaning purchasing power doubles in about 18 years (72 ÷ 4). Ignoring inflation can significantly overestimate actual wealth growth.",
    },
    {
      question: "Why is the number 72 used instead of other numbers?",
      answer: "The number 72 was chosen because it has many divisors (1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72), making mental math easier at various common interest rates. At 8%, money doubles in 9 years; at 6%, it takes 12 years; at 4%, it requires 18 years. Some mathematicians prefer Rule of 69.3 for greater precision, but 72 offers a practical balance between accuracy and ease of calculation.",
    },
    {
      question: "Can the Rule of 72 be used for loan debt that's compounding?",
      answer: "Yes, the Rule of 72 works inversely for debt growth. If your credit card debt carries a 24% APR, the outstanding balance doubles approximately every 3 years (72 ÷ 24 = 3). This demonstrates why high-interest debt is particularly dangerous—a $5,000 balance becomes $10,000 in 3 years, then $20,000 in 6 years if only minimum payments are made and no additional charges are incurred.",
    },
    {
      question: "How do I factor in regular contributions when using the Rule of 72?",
      answer: "The Rule of 72 assumes a single lump-sum investment with no additional contributions. If you're adding monthly or annual contributions, your money will actually double faster than the calculator suggests. For example, with a 7% return and monthly $500 contributions, doubling happens sooner than the predicted 10.3 years because you're continuously investing new capital at compound returns.",
    },
    {
      question: "What's the difference between simple and compound interest in the Rule of 72?",
      answer: "The Rule of 72 is based on compound interest, where earnings generate their own earnings over time. With simple interest at 6%, you'd gain only 6% annually on your original principal, taking much longer to double. Compound interest is far more powerful—at 6% compounded annually, your money doubles in 12 years, while simple interest would take 16.67 years to double the original amount.",
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
    const interestRateValue = parseFloat(inputs.interestRate) || 0;
    const initialInvestmentValue = parseFloat(inputs.initialInvestment) || 0;

    // Validate
    if (interestRateValue <= 0 || initialInvestmentValue <= 0) {
      return { 
        yearsToDouble: 0, 
        doubledInvestment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations using Rule of 72
    const yearsToDouble = 72 / interestRateValue;
    const doubledInvestment = initialInvestmentValue * 2;

    // Generate schedule data for visualization
    const scheduleData = Array.from({ length: Math.ceil(yearsToDouble) }, (_, i) => ({
      year: i + 1,
      balance: initialInvestmentValue * Math.pow(1 + interestRateValue / 100, i + 1)
    }));

    return { 
      yearsToDouble, 
      doubledInvestment, 
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
    setInputs({ interestRate: "", initialInvestment: "" });
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
              Initial Investment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.initialInvestment}
              onChange={(e) => setInputs({ ...inputs, initialInvestment: e.target.value })}
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
              placeholder="e.g., 6"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
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
      {results.yearsToDouble > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Years to Double Investment
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.yearsToDouble.toFixed(1)}
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
                      Doubled Investment Value
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.doubledInvestment)}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-gray-400" />
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
                    Investment Growth Schedule
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
                        : `Show All ${results.scheduleData.length} Years`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Year</TableHead>
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
                            <TableCell className="font-medium">{row.year}</TableCell>
                            <TableCell>{formatCurrency(row.balance)}</TableCell>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Rule of 72 Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Rule of 72 Calculator is a quick estimation tool that determines how long your money takes to double at a given annual return rate. This simple yet powerful financial concept helps you understand the compounding effect of investments and debt growth. Whether you're planning retirement savings, comparing investment options, or evaluating the cost of high-interest debt, this calculator provides instant insight into long-term wealth accumulation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your expected annual return rate as a percentage. This could be your investment portfolio's average return (7-10% for stocks), your savings account interest rate (currently 4-5% for high-yield accounts), or even a loan's APR if you're calculating debt growth. The calculator then applies the Rule of 72 formula (72 ÷ annual rate = doubling time) to instantly show how many years until your money or debt doubles.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by understanding that the output represents approximate doubling time in years. At an 8% annual return, your $10,000 investment becomes $20,000 in roughly 9 years. Use this timeline to benchmark against your financial goals—if you need funds to double within 5 years, you'll need an average return of at least 14.4% annually. Remember that this calculator provides estimates; actual results depend on consistent returns, compound frequency, and whether additional contributions are made.</p>
        </div>
      </section>

      {/* TABLE: Rule of 72: Doubling Time by Annual Return Rate */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Rule of 72: Doubling Time by Annual Return Rate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how many years it takes for an investment to double at various annual return rates using the Rule of 72 formula.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Return Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years to Double (Rule of 72)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Actual Years to Double</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Accuracy Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.9% error</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4% error</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9% error</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3% error</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8% error</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6% error</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.01</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1% error</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0% error</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0% error</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2% error</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Accuracy is highest between 5% and 10% returns. At extreme rates (below 2% or above 15%), use the precise compound interest formula instead.</p>
      </section>

      {/* TABLE: Historical Investment Doubling Periods (1926-2024) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Historical Investment Doubling Periods (1926-2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These estimates show how long different asset classes have historically taken to double based on average annual returns.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Asset Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Annual Return (1926-2024)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Historical Doubling Period</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Number of Doublings Since 1926</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">S&P 500 (stocks)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.1 times</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">US Treasury Bonds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.1 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0 times</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corporate Bonds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.4 times</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gold</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.8 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.8 times</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Real Estate (median home)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.9 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.2 times</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Savings Account (current)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.42%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">171 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.11 times</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Yield Savings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.75%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.6 times</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Money Market Funds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.1 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9 times</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Historical returns do not guarantee future performance. Past data reflects nominal (pre-inflation) returns. Current savings rates are as of 2024.</p>
      </section>

      {/* TABLE: Credit Card Debt Doubling Time at Various APR Rates */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Credit Card Debt Doubling Time at Various APR Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how quickly credit card balances compound and double at typical APR rates, showing the cost of high-interest debt.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Card APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years to Double Balance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Original $5,000 Becomes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Paid to Double</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.8 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.0 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">21%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.4 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">27%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">29.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These calculations assume no payments or additional charges are made. The average US credit card APR was 21.59% as of Q4 2024.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare the Rule of 72 results across different investment types to understand opportunity costs—if stocks double every 7 years but bonds take 12 years, the 5-year difference highlights the power of equity allocation in long-term portfolios.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to set realistic return expectations by working backward: if you want your money to double in 10 years, divide 72 by 10 to find you need approximately 7.2% annual returns, helping you select appropriate investment vehicles.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Apply the Rule of 72 to debt management by calculating how quickly high-interest credit card balances grow—a 24% APR doubles your balance in just 3 years, creating urgency to pay down debt before compound interest overwhelms your finances.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for inflation by subtracting the current inflation rate (typically 2-3% annually) from your investment return to find your real purchasing power doubling time—a 7% stock return minus 3% inflation means your real wealth doubles every 14.4 years, not 10.3 years.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring inflation when planning long-term investments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many investors celebrate a 6% return without realizing that 3% inflation reduces real wealth growth to 3%, doubling actual purchasing power in 24 years instead of 12. Always adjust returns for inflation when planning retirement or long-term goals to avoid overestimating true wealth accumulation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the Rule of 72 for returns below 2% or above 20%</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The Rule of 72 loses accuracy at extreme rates. A savings account earning 0.5% would take 144 years by the rule, but the actual time is 139 years. For very low or very high rates, use a precise compound interest calculator instead.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting that this assumes no additional contributions or withdrawals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The Rule of 72 calculates doubling for a single lump-sum investment. If you contribute monthly like in a 401(k) or IRA, your money doubles much faster than the calculator predicts because you're continuously investing new capital.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming past returns guarantee future performance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While the S&P 500 averaged 10% since 1926, any given decade may see 5% or 15% returns. The Rule of 72 is a planning tool, not a guarantee—adjust your rate assumptions based on realistic expectations and diversification, not historical averages alone.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Rule of 72 and how does this calculator use it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Rule of 72 is a simple formula that estimates how many years it takes for an investment to double at a given annual interest rate. The calculator divides 72 by your annual return rate to instantly show doubling time. For example, at a 6% annual return, your money doubles in approximately 12 years (72 ÷ 6 = 12). This rule works best for returns between 3% and 10%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the Rule of 72 Calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Rule of 72 is remarkably accurate for moderate interest rates between 3% and 10%, typically within 0.1 to 0.2 years of the true doubling time. At 5% annual returns, the rule estimates 14.4 years, while the actual time is 14.21 years. However, accuracy decreases significantly at very high rates (above 15%) or very low rates (below 2%).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the Rule of 72 for investment accounts earning less than 3%?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While technically possible, the Rule of 72 becomes less accurate below 3% returns. A savings account earning 0.5% APY would theoretically take 144 years to double according to the rule, but the actual time is 138.6 years. For rates below 3%, using the more precise Rule of 69.3 or an exact compound interest calculation provides better accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What average annual returns should I assume for stocks and bonds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Historically, the S&P 500 has averaged approximately 10% annual returns since 1926 (including dividends), suggesting stocks double every 7.2 years. Investment-grade bonds have averaged around 5-6% annually, implying a doubling period of 12-14.4 years. However, past performance doesn't guarantee future results, and actual returns vary year to year.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does inflation affect the Rule of 72 doubling time calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Rule of 72 typically calculates nominal doubling time (before adjusting for inflation), but you should compare your rate against inflation for real purchasing power growth. If your investment returns 7% annually but inflation is 3%, your real return is approximately 4%, meaning purchasing power doubles in about 18 years (72 ÷ 4). Ignoring inflation can significantly overestimate actual wealth growth.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is the number 72 used instead of other numbers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The number 72 was chosen because it has many divisors (1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72), making mental math easier at various common interest rates. At 8%, money doubles in 9 years; at 6%, it takes 12 years; at 4%, it requires 18 years. Some mathematicians prefer Rule of 69.3 for greater precision, but 72 offers a practical balance between accuracy and ease of calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the Rule of 72 be used for loan debt that's compounding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the Rule of 72 works inversely for debt growth. If your credit card debt carries a 24% APR, the outstanding balance doubles approximately every 3 years (72 ÷ 24 = 3). This demonstrates why high-interest debt is particularly dangerous—a $5,000 balance becomes $10,000 in 3 years, then $20,000 in 6 years if only minimum payments are made and no additional charges are incurred.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I factor in regular contributions when using the Rule of 72?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Rule of 72 assumes a single lump-sum investment with no additional contributions. If you're adding monthly or annual contributions, your money will actually double faster than the calculator suggests. For example, with a 7% return and monthly $500 contributions, doubling happens sooner than the predicted 10.3 years because you're continuously investing new capital at compound returns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between simple and compound interest in the Rule of 72?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Rule of 72 is based on compound interest, where earnings generate their own earnings over time. With simple interest at 6%, you'd gain only 6% annually on your original principal, taking much longer to double. Compound interest is far more powerful—at 6% compounded annually, your money doubles in 12 years, while simple interest would take 16.67 years to double the original amount.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.investopedia.com/terms/r/ruleof72.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Rule of 72 Explanation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to the Rule of 72 formula, its history, and how to apply it to investment planning.</p>
          </li>
          <li>
            <a href="https://www.sec.gov/investor/alerts/compoundinterest.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC: Investor Bulletin on Compound Interest</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SEC resource explaining compound interest mechanics and the long-term effects on investment growth.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/datadownload/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve: Historical Stock Market Returns</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Reserve Economic Data (FRED) providing historical return rates and economic indicators for investment analysis.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/credit-cards/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau: Credit Card Interest Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB consumer guide to understanding credit card APR, compounding, and the true cost of high-interest debt.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Rule of 72 Calculator"
      description="Quickly estimate how long it will take to double your investment. Use the Rule of 72 formula for fast mental math on investment growth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Rule of 72 Calculator" },
        { id: "formula", label: "Rule of 72 Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Years to Double = 72 / Interest Rate",
        variables: [
          { symbol: "Interest Rate", description: "The annual interest rate expressed as a percentage" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an initial investment of $10,000 with an annual interest rate of 6%.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "72 / 6 = 12", 
            explanation: "Calculate the number of years to double the investment." 
          },
          { 
            label: "Step 2", 
            calculation: "$10,000 × 2 = $20,000", 
            explanation: "Determine the doubled investment value." 
          }
        ],
        result: "The final result is $20,000, meaning your investment will double in approximately 12 years."
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
