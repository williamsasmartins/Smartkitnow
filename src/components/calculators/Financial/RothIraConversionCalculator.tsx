import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RothIraConversionCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    traditionalIraBalance: "", 
    expectedTaxRate: "", 
    yearsUntilRetirement: "" 
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
    const traditionalIraBalance = parseFloat(inputs.traditionalIraBalance) || 0;
    const expectedTaxRate = parseFloat(inputs.expectedTaxRate) || 0;
    const yearsUntilRetirement = parseFloat(inputs.yearsUntilRetirement) || 0;

    // Validate
    if (traditionalIraBalance <= 0 || expectedTaxRate <= 0) {
      return { 
        mainResult: 0, 
        taxCost: 0, 
        futureValue: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const taxCost = traditionalIraBalance * (expectedTaxRate / 100);
    const rothIraBalance = traditionalIraBalance - taxCost;
    const futureValue = rothIraBalance * Math.pow(1.07, yearsUntilRetirement); // Assuming 7% annual growth

    // Generate schedule data if applicable (e.g., growth over time)
    const scheduleData = Array.from({ length: yearsUntilRetirement }, (_, i) => ({
      year: i + 1,
      balance: rothIraBalance * Math.pow(1.07, i + 1)
    }));

    return { 
      mainResult: futureValue, 
      taxCost, 
      futureValue, 
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
    setInputs({ traditionalIraBalance: "", expectedTaxRate: "", yearsUntilRetirement: "" });
  };

  const faqs = [
    {
      question: "How accurate are Roth IRA conversion calculations and what limitations should I be aware of?",
      answer: "This calculator provides estimates based on the inputs you provide. For Roth IRA conversion, accuracy depends on using current tax bracket management data -- rates, prices, and regulatory thresholds change frequently. The results are most reliable for planning purposes and comparative analysis. For financial decisions involving significant amounts, verify results against official sources or consult a tax bracket management professional."
    },
    {
      question: "What key factors most affect Roth IRA conversion results?",
      answer: "The most impactful variables in Roth IRA conversion calculations are typically the primary rate or percentage input and the time horizon. Small changes in these variables compound significantly over longer periods. For example, a 1% difference in return rate over 20 years can change outcomes by 20–30%. Always run the calculation at multiple input values to understand your sensitivity to each variable."
    },
    {
      question: "When should I recalculate Roth IRA conversion?",
      answer: "Recalculate whenever tax bracket management conditions change significantly: after major tax bracket management events, when your inputs change (income, rates, holdings), or when tax bracket management regulations are updated. For time-sensitive tax bracket management metrics, recalculate monthly. For long-term planning tools, a quarterly review is typically sufficient. Set a calendar reminder to revisit projections annually at minimum."
    },
    {
      question: "How does Roth IRA conversion relate to other financial planning metrics?",
      answer: "No single metric tells the complete financial picture. Roth ira conversion should be evaluated alongside related measures like retirement planning. These metrics interact: improving one often affects another. Build a dashboard of 3–5 key metrics that together reflect the health of your tax bracket management situation, rather than optimizing any single number in isolation."
    },
    {
      question: "What are the most common mistakes when calculating Roth IRA conversion?",
      answer: "The most frequent errors in Roth IRA conversion calculations: (1) Using pre-tax instead of post-tax figures where after-tax analysis is needed, (2) Ignoring fees and transaction costs that reduce net returns, (3) Using nominal figures without inflation adjustment for long-horizon projections, (4) Assuming constant rates -- real-world tax bracket management conditions fluctuate. Double-check your inputs against current tax bracket management data before relying on results for significant financial decisions."
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
              Traditional IRA Balance
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.traditionalIraBalance}
              onChange={(e) => setInputs({ ...inputs, traditionalIraBalance: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Expected Tax Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 25"
              value={inputs.expectedTaxRate}
              onChange={(e) => setInputs({ ...inputs, expectedTaxRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Years Until Retirement
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.yearsUntilRetirement}
              onChange={(e) => setInputs({ ...inputs, yearsUntilRetirement: e.target.value })}
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
                      Future Value of Roth IRA
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
                      Tax Cost of Conversion
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.taxCost)}
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
                      Initial Roth IRA Balance
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.futureValue)}
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
                    Growth Schedule
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Roth IRA Conversion Calculator
        </h2>
        
        <p className="mb-6">
          The Roth IRA Conversion Calculator is a powerful tool designed to help individuals evaluate the financial implications of converting their traditional IRA into a Roth IRA. This conversion can be a strategic move for those looking to benefit from tax-free growth in retirement. By analyzing the tax cost now against the potential tax-free withdrawals in the future, users can make informed decisions about their retirement planning. This calculator is particularly useful for individuals nearing retirement age or those expecting a higher tax rate in the future, as it provides a clear picture of the potential long-term benefits and costs associated with the conversion.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the realm of retirement planning, as even minor errors can lead to significant financial consequences. The Roth IRA Conversion Calculator ensures precision by factoring in current tax rates, expected growth rates, and the time horizon until retirement. By providing a detailed analysis, this tool helps users avoid costly mistakes and optimize their retirement strategy. For those considering a conversion, understanding the tax implications is essential, and this calculator serves as a reliable guide. For additional insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> to understand how loan payments can impact your overall financial plan.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your current traditional IRA balance, the expected tax rate at the time of conversion, and the number of years until you plan to retire. Enter these values into the calculator to receive an estimate of the tax cost and the future value of your Roth IRA. This step-by-step approach ensures that you have a comprehensive understanding of the conversion process and its potential outcomes. For further guidance, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> for insights into managing long-term financial commitments.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            When considering a Roth IRA conversion, timing is everything. Converting during a year when your income is lower than usual can minimize the tax impact. Additionally, spreading the conversion over several years may help manage tax liabilities more effectively. Always consult with a financial advisor to tailor the strategy to your specific financial situation.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs as your financial situation changes. Factors such as changes in tax laws, shifts in income, or adjustments to your retirement timeline can all impact the results. By staying informed and proactive, you can make the most of your retirement planning efforts and ensure that your financial future is secure.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Roth IRA Conversion Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Roth IRA Conversion Calculator uses a straightforward formula to estimate the tax cost of converting a traditional IRA to a Roth IRA and the future value of the converted funds. This formula is based on the current balance of the traditional IRA, the expected tax rate at the time of conversion, and the anticipated growth rate of the Roth IRA investments. The formula is widely accepted in financial planning circles due to its simplicity and effectiveness in providing a clear picture of the conversion's financial impact.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Future Value = (Traditional IRA Balance - Tax Cost) × (1 + Growth Rate) ^ Years
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Traditional IRA Balance = Current balance of your traditional IRA</li>
              <li>Tax Cost = Traditional IRA Balance × (Expected Tax Rate / 100)</li>
              <li>Growth Rate = Assumed annual growth rate of the Roth IRA investments</li>
              <li>Years = Number of years until retirement</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the outcome of the conversion. The Traditional IRA Balance is the starting point for the calculation, representing the amount you plan to convert. The Tax Cost is calculated based on your expected tax rate, which can vary depending on your income and tax bracket. The Growth Rate is an estimate of how much your investments will grow annually, typically based on historical market performance. Finally, the Years variable represents the time horizon until retirement, allowing you to see the long-term benefits of the conversion.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence the results of a Roth IRA conversion is essential for making informed decisions. These factors interact in complex ways, and a thorough analysis can help you optimize your retirement strategy. Here are the key factors to consider:
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Current Tax Rate
        </h3>
        <p className="mb-4">
          Your current tax rate is a critical factor in determining the tax cost of the conversion. A higher tax rate means a higher immediate cost, but it could be worth it if you expect your tax rate to be even higher in retirement. Understanding your current tax situation and projecting future changes can help you decide the best time to convert.
        </p>
        <p className="mb-6">
          To optimize this factor, consider converting in a year when your income is lower, potentially resulting in a lower tax rate. Additionally, spreading the conversion over multiple years can help manage the tax impact. For more insights, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Expected Growth Rate
        </h3>
        <p className="mb-4">
          The expected growth rate of your Roth IRA investments significantly impacts the future value of the conversion. A higher growth rate means greater tax-free growth potential, making the conversion more attractive. Historical market performance can provide a baseline for estimating this rate.
        </p>
        <p className="mb-6">
          Consider diversifying your investments to achieve a balanced growth rate. While higher-risk investments may offer higher returns, they also come with increased volatility. Assess your risk tolerance and investment strategy to determine the appropriate growth rate for your situation.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Time Horizon
        </h3>
        <p className="mb-4">
          The number of years until retirement affects the compounding growth of your Roth IRA. A longer time horizon allows more time for your investments to grow, increasing the benefits of the conversion. However, it also means a longer wait before accessing the funds tax-free.
        </p>
        <p className="mb-6">
          If you're close to retirement, consider whether the immediate tax cost outweighs the potential growth. For those with a longer time horizon, the compounding effect can make the conversion more advantageous. Consult with a financial advisor to align your retirement timeline with your conversion strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Future Tax Rate
        </h3>
        <p className="mb-6">
          Anticipating your future tax rate is essential for evaluating the benefits of a Roth IRA conversion. If you expect your tax rate to be higher in retirement, converting now could save you money in the long run. Conversely, if you anticipate a lower tax rate, the conversion may not be as beneficial.
        </p>
        <p className="mb-6">
          Consider factors such as changes in tax laws, shifts in income, and potential deductions or credits that could affect your future tax rate. By projecting these changes, you can make a more informed decision about the timing and scale of your conversion.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Legal and Regulatory Considerations
        </h3>
        <p className="mb-6">
          Legal and regulatory factors can also impact your decision to convert. Changes in tax laws or retirement account regulations may alter the benefits of a Roth IRA conversion. Staying informed about these changes and consulting with a tax professional can help you navigate the complexities of the conversion process.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
                {faq.question}
              </h3>
              <div 
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: REFERENCES WITH DESCRIPTIONS (MANDATORY) */}
      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Official References & Resources
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.federalreserve.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access comprehensive economic data and research from the Federal Reserve.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.consumerfinance.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Consumer Financial Protection Bureau - Retirement Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Explore resources and guides on retirement planning and financial protection.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.fdic.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                FDIC - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Learn about banking regulations and financial education from the FDIC.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.irs.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Internal Revenue Service - Retirement Topics
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official IRS guidelines and information on retirement accounts and conversions.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.investopedia.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Investopedia - Roth IRA Conversion
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed explanations and guides on Roth IRA conversions and financial planning.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.nerdwallet.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                NerdWallet - Retirement Planning Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for effective retirement planning.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Roth IRA Conversion Calculator"
      description="Analyze the tax implications of converting a traditional IRA to a Roth IRA. Determine if the tax cost now is worth the tax-free growth later."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Roth IRA Conversion Calculator" },
        { id: "formula", label: "Roth IRA Conversion Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Future Value = (Traditional IRA Balance - Tax Cost) × (1 + Growth Rate) ^ Years",
        variables: [
          { symbol: "Traditional IRA Balance", description: "Current balance of your traditional IRA" },
          { symbol: "Tax Cost", description: "Traditional IRA Balance × (Expected Tax Rate / 100)" },
          { symbol: "Growth Rate", description: "Assumed annual growth rate of the Roth IRA investments" },
          { symbol: "Years", description: "Number of years until retirement" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a traditional IRA balance of $50,000, an expected tax rate of 25%, and 20 years until retirement.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Tax Cost = 50000 × 0.25 = 12500", 
            explanation: "Calculate the tax cost of the conversion." 
          },
          { 
            label: "Step 2", 
            calculation: "Roth IRA Balance = 50000 - 12500 = 37500", 
            explanation: "Determine the initial Roth IRA balance after conversion." 
          },
          { 
            label: "Step 3", 
            calculation: "Future Value = 37500 × (1 + 0.07) ^ 20 = 144,753.58", 
            explanation: "Calculate the future value of the Roth IRA." 
          }
        ],
        result: "The final result is $144,753.58, meaning your Roth IRA will grow to this amount over 20 years with a 7% annual growth rate."
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