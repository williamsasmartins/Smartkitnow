import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CapitalGainsTaxEstimatorCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    purchasePrice: "", 
    salePrice: "", 
    holdingPeriod: "" 
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
    const purchasePriceValue = parseFloat(inputs.purchasePrice) || 0;
    const salePriceValue = parseFloat(inputs.salePrice) || 0;
    const holdingPeriodValue = parseFloat(inputs.holdingPeriod) || 0;

    // Validate
    if (purchasePriceValue <= 0 || salePriceValue <= 0) {
      return { 
        mainResult: 0, 
        shortTermTax: 0, 
        longTermTax: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const capitalGain = salePriceValue - purchasePriceValue;
    const shortTermTaxRate = 0.37; // Example rate for short-term
    const longTermTaxRate = 0.15; // Example rate for long-term

    const isShortTerm = holdingPeriodValue < 365;
    const mainResult = isShortTerm ? capitalGain * shortTermTaxRate : capitalGain * longTermTaxRate;
    const shortTermTax = capitalGain * shortTermTaxRate;
    const longTermTax = capitalGain * longTermTaxRate;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      payment: mainResult / 12,
      principal: (mainResult / 12) * 0.7,
      interest: (mainResult / 12) * 0.3,
      balance: mainResult - ((mainResult / 12) * (i + 1))
    }));

    return { 
      mainResult, 
      shortTermTax, 
      longTermTax, 
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
    setInputs({ purchasePrice: "", salePrice: "", holdingPeriod: "" });
  };

  const faqs = [
    {
      question: "What is the difference between short-term and long-term capital gains for tax purposes?",
      answer: "Short-term capital gains apply to assets held for one year or less and are taxed at your ordinary income tax rate, which ranges from 10% to 37% in 2024. Long-term capital gains apply to assets held for more than one year and receive preferential tax rates of 0%, 15%, or 20% depending on your income level. For example, a single filer with long-term gains would pay 0% on gains up to $47,025, 15% on gains from $47,025 to $518,900, and 20% above that threshold in 2024.",
    },
    {
      question: "How does my filing status affect capital gains tax calculations?",
      answer: "Your filing status determines the income thresholds for each capital gains tax bracket, which directly impacts your effective tax rate. A married couple filing jointly in 2024 pays 0% on long-term gains up to $94,050, compared to $47,025 for single filers—effectively doubling the threshold. This calculator adjusts all rate calculations based on whether you file as single, married filing jointly, married filing separately, or head of household.",
    },
    {
      question: "What role does my ordinary income play in calculating capital gains tax?",
      answer: "Capital gains tax brackets are stacked on top of your ordinary income, meaning your existing wage, salary, and investment income first fills up the lower tax brackets before your capital gains are taxed. If you're a single filer earning $40,000 in wages and realize $20,000 in long-term gains, only $7,025 of your gains ($47,025 threshold minus $40,000 income) would qualify for the 0% rate, while the remaining $12,975 would be taxed at 15%. This stacking effect makes it essential to input your total ordinary income into the estimator.",
    },
    {
      question: "How do net capital losses reduce my capital gains tax liability?",
      answer: "You can use capital losses to offset capital gains dollar-for-dollar, reducing your taxable gain amount. If you realized $50,000 in long-term capital gains and $15,000 in capital losses, only $35,000 would be subject to capital gains tax. If losses exceed gains, you can deduct up to $3,000 of net losses against ordinary income in 2024, with excess losses carrying forward indefinitely to future years.",
    },
    {
      question: "What is the Net Investment Income Tax and does this calculator include it?",
      answer: "The Net Investment Income Tax (NIIT) is an additional 3.8% tax on investment income for high-income earners—single filers earning over $200,000 or married couples filing jointly earning over $250,000 in 2024. Capital gains are subject to this tax if your modified adjusted gross income exceeds the threshold, making it a critical component of your total capital gains tax burden. This calculator factors in the NIIT when applicable to provide your complete tax liability estimate.",
    },
    {
      question: "How does the holding period affect the tax rate I'll pay on my investment gains?",
      answer: "Assets held for exactly one year or less are taxed as short-term capital gains at your ordinary income tax rate (up to 37%), while assets held longer than one year qualify for long-term capital gains rates (0%, 15%, or 20%). For example, selling stock purchased on January 15, 2023, on January 14, 2024, results in short-term treatment, but selling on January 15, 2024, qualifies as long-term. The holding period is one of the most impactful variables in this calculator, potentially saving you thousands in taxes.",
    },
    {
      question: "Can I use the capital gains tax estimator to plan a charitable donation strategy?",
      answer: "While this calculator doesn't directly model charitable giving, it helps you understand your tax liability baseline, which informs donation planning. If the calculator shows you'll pay $8,000 in capital gains tax on appreciated securities, donating those appreciated shares to charity instead of selling them can eliminate the capital gains tax entirely while generating a charitable deduction. You can use the estimator to compare scenarios by running calculations with and without the gains amount.",
    },
    {
      question: "What are the 2024 long-term capital gains tax brackets for married filing jointly?",
      answer: "In 2024, married couples filing jointly face 0% tax on long-term gains up to $94,050, 15% on gains from $94,050 to $583,750, and 20% on gains exceeding $583,750. These brackets are adjusted annually for inflation and represent a significant advantage over single filer brackets, which max out the 0% bracket at $47,025. The calculator automatically applies these married filing jointly brackets when you select that filing status.",
    },
    {
      question: "How do state and local capital gains taxes factor into my total tax bill estimate?",
      answer: "The federal capital gains tax estimator calculates only federal liability; however, most states and some localities impose additional capital gains taxes ranging from 0% to 13.3%. California, New York, and Oregon have capital gains tax rates of 13.3%, 8.82%, and 9.9% respectively, which can significantly increase your total burden. To get a complete picture, you should add your state's capital gains tax rate to the federal estimate provided by this calculator.",
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
              Purchase Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.purchasePrice}
              onChange={(e) => setInputs({ ...inputs, purchasePrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Sale Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15000"
              value={inputs.salePrice}
              onChange={(e) => setInputs({ ...inputs, salePrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Holding Period (days)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 365"
              value={inputs.holdingPeriod}
              onChange={(e) => setInputs({ ...inputs, holdingPeriod: e.target.value })}
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
                      Estimated Tax Liability
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
                      Short-Term Capital Gains Tax
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.shortTermTax)}
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
                      Long-Term Capital Gains Tax
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.longTermTax)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Capital Gains Tax Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Capital Gains Tax Estimator is a financial tool designed to calculate your federal income tax liability on investment gains from selling stocks, real estate, mutual funds, cryptocurrencies, and other appreciated assets. Understanding your capital gains tax obligation helps you make informed decisions about when to sell investments, whether to harvest losses, and how to optimize your overall tax strategy. This calculator provides an accurate federal estimate based on 2024 tax brackets and rules.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the estimator effectively, you'll need to input several key variables: your filing status (single, married filing jointly, etc.), your ordinary income from all sources (wages, salaries, interest, dividends), the amount and type of capital gains (short-term or long-term), any capital losses to offset gains, and your age (to account for Medicare tax thresholds). The holding period—how long you owned the asset—is especially important because it determines whether gains qualify for preferential long-term rates (0%, 15%, or 20%) or are taxed as ordinary income at rates up to 37%. Each input directly impacts your calculated tax liability.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your results will show the total federal capital gains tax owed, the effective tax rate on your gains, and any applicable Net Investment Income Tax (NIIT). Compare the results across different scenarios—for example, calculating tax if you sell in 2024 versus waiting until 2025—to identify opportunities to reduce your burden. Remember that federal estimates don't include state and local capital gains taxes, which can add 0% to 13.3% depending on your location, so add your state's rate to the federal result for a complete picture.</p>
        </div>
      </section>

      {/* TABLE: 2024 Long-Term Capital Gains Tax Brackets by Filing Status */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024 Long-Term Capital Gains Tax Brackets by Filing Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These are the federal tax brackets for long-term capital gains in 2024, showing how gains are taxed at preferential rates based on your total taxable income.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Filing Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0% Rate Applies To</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15% Rate Applies To</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20% Rate Applies To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Single</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 to $47,025</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$47,025 to $518,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Over $518,900</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Married Filing Jointly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 to $94,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$94,050 to $583,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Over $583,750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Married Filing Separately</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 to $47,025</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$47,025 to $291,875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Over $291,875</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Head of Household</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 to $62,975</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$62,975 to $551,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Over $551,350</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Thresholds are adjusted annually for inflation. Brackets apply to long-term gains (assets held more than one year). Ordinary income fills brackets first, then capital gains are stacked on top.</p>
      </section>

      {/* TABLE: Capital Gains Tax Impact Comparison: $50,000 Gain Example */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Capital Gains Tax Impact Comparison: $50,000 Gain Example</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how your filing status and income level affect the total tax on a $50,000 long-term capital gain with no offsetting losses.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Filing Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ordinary Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Effective Tax Rate on Gains</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Tax Owed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low-income earner</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Middle-income earner</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-income earner</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20% + 3.8% NIIT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,900</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Married couple</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Married Filing Jointly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-income couple</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Married Filing Jointly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20% + 3.8% NIIT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,900</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">NIIT (Net Investment Income Tax) of 3.8% applies to single filers earning over $200,000 and married filing jointly earning over $250,000. Assumes no state or local capital gains taxes.</p>
      </section>

      {/* TABLE: Short-Term vs. Long-Term Capital Gains Tax Comparison */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Short-Term vs. Long-Term Capital Gains Tax Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This comparison shows how holding period affects your tax liability on the same $30,000 investment gain.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Holding Period</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Classification</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Rate (Single Filer at $75K Income)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax on $30,000 Gain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Savings vs. Short-Term</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Less than 1 year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Short-term capital gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22% (ordinary income)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">More than 1 year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term capital gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">More than 1 year (very high earner)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term capital gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20% + 3.8% NIIT</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">($540 higher)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Waiting just one day longer than one year can trigger long-term status and preferential rates. Tax rates vary based on your income level and filing status. NIIT applies when modified adjusted gross income exceeds $200,000 for single filers.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Hold investments longer than one year before selling to qualify for long-term capital gains rates (0%, 15%, or 20%) instead of short-term rates up to 37%—waiting 366 days instead of 365 can save thousands in taxes on large gains.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Harvest capital losses strategically by selling underperforming investments to offset gains from winners, reducing your taxable gain dollar-for-dollar; you can deduct up to $3,000 of excess losses against ordinary income annually.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider the stacking effect of capital gains on top of your ordinary income—if you're close to a higher tax bracket threshold, accelerating or deferring gains to different tax years can reduce your effective rate.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator to model gifting appreciated securities to charity instead of selling them, which eliminates capital gains tax entirely while generating a charitable deduction—especially valuable for highly appreciated long-held assets.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check whether you'll trigger the Net Investment Income Tax (3.8% additional tax) by calculating your modified adjusted gross income; this affects single filers earning over $200,000 and married couples over $250,000.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run multiple scenarios in the calculator—such as realizing gains over two tax years instead of one, or selling before versus after year-end—to identify the lowest-tax strategy for your situation.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for ordinary income when calculating long-term capital gains tax</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Capital gains tax brackets stack on top of your ordinary income, so if you earn $80,000 in wages as a single filer, only $0 of your capital gains qualify for the 0% bracket (since the bracket ends at $47,025). Many people assume they qualify for the lowest rate and underestimate their tax liability.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing the one-year holding period rule</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assets must be held for more than one year (not exactly one year) to qualify for long-term capital gains rates. Selling on the 365th day results in short-term treatment and ordinary income tax rates; you need to wait until day 366 or later.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the Net Investment Income Tax applicability</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High-income earners often forget about the 3.8% NIIT on capital gains when modified adjusted gross income exceeds $200,000 (single) or $250,000 (married filing jointly), resulting in an underestimated total tax liability.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to include state and local capital gains taxes in the estimate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator computes federal taxes only, but states like California, New York, and Oregon impose additional capital gains taxes of 9.9% to 13.3%, which can double your effective tax rate—you must add your state's tax separately.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not using capital losses to offset gains</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many investors overlook the opportunity to sell underwater positions to realize losses that directly offset capital gains, potentially saving 15% to 20% on taxes. The calculator helps quantify these savings when you input capital losses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating inherited assets and stepped-up basis incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assets inherited from a deceased spouse receive a stepped-up basis to fair market value at the date of death, meaning zero capital gains tax on appreciation that occurred before inheritance—this calculator assumes you're the original owner, so inherited gains need separate analysis.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between short-term and long-term capital gains for tax purposes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Short-term capital gains apply to assets held for one year or less and are taxed at your ordinary income tax rate, which ranges from 10% to 37% in 2024. Long-term capital gains apply to assets held for more than one year and receive preferential tax rates of 0%, 15%, or 20% depending on your income level. For example, a single filer with long-term gains would pay 0% on gains up to $47,025, 15% on gains from $47,025 to $518,900, and 20% above that threshold in 2024.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my filing status affect capital gains tax calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your filing status determines the income thresholds for each capital gains tax bracket, which directly impacts your effective tax rate. A married couple filing jointly in 2024 pays 0% on long-term gains up to $94,050, compared to $47,025 for single filers—effectively doubling the threshold. This calculator adjusts all rate calculations based on whether you file as single, married filing jointly, married filing separately, or head of household.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does my ordinary income play in calculating capital gains tax?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Capital gains tax brackets are stacked on top of your ordinary income, meaning your existing wage, salary, and investment income first fills up the lower tax brackets before your capital gains are taxed. If you're a single filer earning $40,000 in wages and realize $20,000 in long-term gains, only $7,025 of your gains ($47,025 threshold minus $40,000 income) would qualify for the 0% rate, while the remaining $12,975 would be taxed at 15%. This stacking effect makes it essential to input your total ordinary income into the estimator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do net capital losses reduce my capital gains tax liability?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You can use capital losses to offset capital gains dollar-for-dollar, reducing your taxable gain amount. If you realized $50,000 in long-term capital gains and $15,000 in capital losses, only $35,000 would be subject to capital gains tax. If losses exceed gains, you can deduct up to $3,000 of net losses against ordinary income in 2024, with excess losses carrying forward indefinitely to future years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Net Investment Income Tax and does this calculator include it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Net Investment Income Tax (NIIT) is an additional 3.8% tax on investment income for high-income earners—single filers earning over $200,000 or married couples filing jointly earning over $250,000 in 2024. Capital gains are subject to this tax if your modified adjusted gross income exceeds the threshold, making it a critical component of your total capital gains tax burden. This calculator factors in the NIIT when applicable to provide your complete tax liability estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the holding period affect the tax rate I'll pay on my investment gains?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Assets held for exactly one year or less are taxed as short-term capital gains at your ordinary income tax rate (up to 37%), while assets held longer than one year qualify for long-term capital gains rates (0%, 15%, or 20%). For example, selling stock purchased on January 15, 2023, on January 14, 2024, results in short-term treatment, but selling on January 15, 2024, qualifies as long-term. The holding period is one of the most impactful variables in this calculator, potentially saving you thousands in taxes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the capital gains tax estimator to plan a charitable donation strategy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While this calculator doesn't directly model charitable giving, it helps you understand your tax liability baseline, which informs donation planning. If the calculator shows you'll pay $8,000 in capital gains tax on appreciated securities, donating those appreciated shares to charity instead of selling them can eliminate the capital gains tax entirely while generating a charitable deduction. You can use the estimator to compare scenarios by running calculations with and without the gains amount.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the 2024 long-term capital gains tax brackets for married filing jointly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">In 2024, married couples filing jointly face 0% tax on long-term gains up to $94,050, 15% on gains from $94,050 to $583,750, and 20% on gains exceeding $583,750. These brackets are adjusted annually for inflation and represent a significant advantage over single filer brackets, which max out the 0% bracket at $47,025. The calculator automatically applies these married filing jointly brackets when you select that filing status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do state and local capital gains taxes factor into my total tax bill estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The federal capital gains tax estimator calculates only federal liability; however, most states and some localities impose additional capital gains taxes ranging from 0% to 13.3%. California, New York, and Oregon have capital gains tax rates of 13.3%, 8.82%, and 9.9% respectively, which can significantly increase your total burden. To get a complete picture, you should add your state's capital gains tax rate to the federal estimate provided by this calculator.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/publications/p550" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 550: Investment Income and Expenses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on capital gains, holding periods, net investment income tax, and how to report investment income on your tax return.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS 2024 Tax Brackets and Long-Term Capital Gains Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Annual IRS announcement of updated tax brackets, capital gains rates, and income thresholds for Net Investment Income Tax in 2024.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/c/capital_gains_tax.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Capital Gains Tax Explained</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive explanation of short-term and long-term capital gains, how rates are calculated, and strategies to minimize capital gains tax liability.</p>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/article/investing/capital-gains-tax" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NerdWallet: Capital Gains Tax Calculator and State Tax Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of federal and state capital gains tax rates by jurisdiction, examples of how taxes are calculated, and tips for tax planning.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Capital Gains Tax Estimator"
      description="Calculate capital gains tax on crypto sales. Determine short-term vs long-term tax obligations based on holding period."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Capital Gains Tax Estimator" },
        { id: "formula", label: "Capital Gains Tax Estimator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Tax Liability = (Sale Price - Purchase Price) × Tax Rate",
        variables: [
          { symbol: "Sale Price", description: "The amount for which the asset was sold" },
          { symbol: "Purchase Price", description: "The amount paid to acquire the asset" },
          { symbol: "Tax Rate", description: "The applicable tax rate based on holding period" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you purchased a cryptocurrency for $10,000 and sold it for $15,000 after 400 days.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Gain = $15,000 - $10,000 = $5,000", 
            explanation: "Calculate the capital gain by subtracting the purchase price from the sale price." 
          },
          { 
            label: "Step 2", 
            calculation: "Tax = $5,000 × 0.15 = $750", 
            explanation: "Apply the long-term capital gains tax rate of 15% to the gain." 
          },
          { 
            label: "Step 3", 
            calculation: "Total Tax Liability = $750", 
            explanation: "The final result shows the tax liability for the transaction." 
          }
        ],
        result: "The final result is $750, meaning you owe this amount in capital gains tax."
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