import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { useFaqJsonLd } from "@/hooks/useFaqJsonLd";

export default function RetirementSavingsGoalCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    currentAge: "", 
    retirementAge: "", 
    currentSavings: "", 
    annualContribution: "", 
    expectedReturn: "", 
    desiredRetirementIncome: "" 
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
    let currentAge = parseFloat(inputs.currentAge) || 0;
    const retirementAge = parseFloat(inputs.retirementAge) || 0;
    const currentSavings = parseFloat(inputs.currentSavings) || 0;
    const annualContribution = parseFloat(inputs.annualContribution) || 0;
    const expectedReturn = parseFloat(inputs.expectedReturn) / 100 || 0;
    const desiredRetirementIncome = parseFloat(inputs.desiredRetirementIncome) || 0;

    // Validate
    if (currentAge <= 0 || retirementAge <= currentAge || expectedReturn <= 0) {
      return { 
        totalSavings: 0, 
        annualIncome: 0, 
        shortfall: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const yearsToRetirement = retirementAge - currentAge;
    const futureValueOfSavings = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
    const futureValueOfContributions = annualContribution * ((Math.pow(1 + expectedReturn, yearsToRetirement) - 1) / expectedReturn);
    const totalSavings = futureValueOfSavings + futureValueOfContributions;
    const annualIncome = totalSavings * expectedReturn;
    const shortfall = desiredRetirementIncome - annualIncome;

    // Generate schedule data if applicable (e.g., savings growth)
    const scheduleData = Array.from({ length: yearsToRetirement }, (_, i) => {
      const year = i + 1;
      const savingsGrowth = (currentSavings + (annualContribution * year)) * Math.pow(1 + expectedReturn, year);
      return {
        year,
        savings: savingsGrowth,
        balance: savingsGrowth - (annualContribution * year)
      };
    });

    return { 
      totalSavings, 
      annualIncome, 
      shortfall, 
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
      currentAge: "", 
      retirementAge: "", 
      currentSavings: "", 
      annualContribution: "", 
      expectedReturn: "", 
      desiredRetirementIncome: "" 
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
              <DollarSign className="w-4 h-4 text-blue-600"/>
              Current Age
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.currentAge}
              onChange={(e) => setInputs({ ...inputs, currentAge: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Retirement Age
            </Label>
            <Input
              type="number"
              placeholder="e.g., 65"
              value={inputs.retirementAge}
              onChange={(e) => setInputs({ ...inputs, retirementAge: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600"/>
              Current Savings
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.currentSavings}
              onChange={(e) => setInputs({ ...inputs, currentSavings: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Annual Contribution
            </Label>
            <Input
              type="number"
              placeholder="e.g., 6000"
              value={inputs.annualContribution}
              onChange={(e) => setInputs({ ...inputs, annualContribution: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Expected Annual Return (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 7"
              value={inputs.expectedReturn}
              onChange={(e) => setInputs({ ...inputs, expectedReturn: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Desired Retirement Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 40000"
              value={inputs.desiredRetirementIncome}
              onChange={(e) => setInputs({ ...inputs, desiredRetirementIncome: e.target.value })}
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
      {results.totalSavings > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Savings at Retirement
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.totalSavings)}
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
                      Annual Income from Savings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.annualIncome)}
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
                      Income Shortfall
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.shortfall)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SAVINGS GROWTH SCHEDULE TABLE */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Savings Growth Schedule
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
                        <TableHead className="font-semibold">Savings</TableHead>
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
                            <TableCell>{formatCurrency(row.savings)}</TableCell>
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
          Understanding Retirement Savings Goal Calculator
        </h2>
        
        <p className="mb-6">
          Planning for retirement is a crucial aspect of financial management, and having a clear understanding of your savings goals can significantly impact your future lifestyle. The Retirement Savings Goal Calculator is designed to help you determine how much you need to save to achieve your desired retirement income. By inputting your current age, expected retirement age, current savings, annual contributions, and expected rate of return, you can get a comprehensive view of your financial trajectory. This tool is particularly useful for those who are planning their retirement early and want to ensure they have enough funds to maintain their lifestyle post-retirement.
        </p>
        
        <p className="mb-6">
          Accurate calculations are essential in retirement planning, as they help you avoid potential shortfalls that could affect your quality of life in the future. Misjudging your savings needs can lead to financial stress during retirement, a time when you should be enjoying the fruits of your labor. According to recent studies, a significant percentage of retirees regret not saving enough during their working years. This calculator helps mitigate such risks by providing a realistic estimate of your savings needs. For more insights on financial planning, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your current financial status and future goals. You'll need details such as your current age, the age at which you plan to retire, your current savings balance, and how much you plan to contribute annually. Additionally, estimate the annual return you expect from your investments. Enter these values into the calculator to see your projected savings and any potential shortfall. For a deeper understanding of how your contributions can impact your savings, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Regularly reviewing and adjusting your retirement savings plan is crucial. As life circumstances change, so too should your savings strategy. This calculator provides a snapshot based on current data, but revisiting your plan annually can help ensure you stay on track to meet your retirement goals.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include setting realistic expectations for investment returns and considering inflation's impact on your future purchasing power. It's also important to factor in any potential changes in your lifestyle that could affect your retirement needs. By understanding these variables, you can optimize your savings strategy and make informed decisions about your financial future.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Retirement Savings Goal Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Retirement Savings Goal Calculator uses a compound interest formula to estimate the future value of your savings. This formula considers your current savings, annual contributions, and the expected rate of return over the years until retirement. It's a standard approach in financial planning, providing a reliable projection of your savings growth. Variations of this formula may include adjustments for inflation or changes in contribution amounts, but the core principle remains the same: compounding your savings over time to maximize growth.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          FV = P(1 + r)^n + PMT × (((1 + r)^n - 1) / r)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>FV = Future Value of Savings</li>
              <li>P = Current Savings</li>
              <li>r = Annual Rate of Return (as a decimal)</li>
              <li>n = Number of Years to Retirement</li>
              <li>PMT = Annual Contribution</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining your retirement savings. The current savings (P) is your starting point, while the annual rate of return (r) reflects the growth potential of your investments. The number of years to retirement (n) determines how long your savings will compound. Finally, the annual contribution (PMT) represents the additional funds you add each year. Adjusting any of these variables can significantly impact your total savings, highlighting the importance of strategic planning.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your retirement savings is crucial for effective planning. These factors interact in complex ways, and being aware of them can help you make informed decisions about your financial future.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Current Age and Retirement Age
        </h3>
        <p className="mb-4">
          Your current age and the age at which you plan to retire are fundamental factors in your savings plan. The longer your savings have to grow, the more you can benefit from compound interest. Starting early allows for smaller contributions to grow significantly over time, reducing the financial burden later in life.
        </p>
        <p className="mb-6">
          If you're starting later, you may need to increase your annual contributions or adjust your expected retirement lifestyle. Consider using our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> to explore how mortgage payments might affect your savings capacity.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Current Savings and Annual Contributions
        </h3>
        <p className="mb-4">
          The amount you currently have saved and your annual contributions are direct determinants of your future financial security. Larger initial savings and consistent contributions can significantly enhance your retirement fund. It's important to establish a savings plan that aligns with your income and financial goals.
        </p>
        <p className="mb-6">
          Consider increasing your contributions as your income grows. Small percentage increases can have a substantial impact over time. For more insights on optimizing contributions, see our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Expected Rate of Return
        </h3>
        <p className="mb-4">
          The expected rate of return on your investments is a critical factor in your savings growth. Higher returns can significantly increase your total savings, but they often come with higher risk. It's essential to balance your investment strategy between risk and return to achieve your financial goals.
        </p>
        <p className="mb-6">
          Diversifying your investment portfolio can help manage risk while optimizing returns. Consult with a financial advisor to tailor your investment strategy to your risk tolerance and retirement timeline.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Inflation and Economic Factors
        </h3>
        <p className="mb-6">
          Inflation erodes the purchasing power of your savings over time, making it a crucial consideration in retirement planning. It's important to account for inflation when estimating your future expenses and retirement income needs. Economic conditions, such as interest rates and market volatility, can also impact your savings growth.
        </p>
        <p className="mb-6">
          Staying informed about economic trends and adjusting your savings strategy accordingly can help mitigate these risks. Regularly reviewing your plan with a financial advisor can ensure it remains aligned with current economic conditions.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Lifestyle and Health Considerations
        </h3>
        <p className="mb-6">
          Your desired lifestyle and health considerations play a significant role in determining your retirement savings needs. A more luxurious lifestyle will require a larger savings fund, while health-related expenses can also increase your financial requirements. It's important to plan for potential healthcare costs and consider long-term care insurance as part of your retirement strategy.
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
              <p 
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
                Official data on economic conditions and monetary policy.
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
                Comprehensive resources for retirement planning and consumer protection.
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
                Banking regulations and educational resources for financial literacy.
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
                Internal Revenue Service - Retirement Plans
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official guidelines on retirement plans and tax implications.
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
                Investopedia - Retirement Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed articles and guides on retirement planning strategies.
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
                NerdWallet - Retirement Savings
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and tools for retirement savings.
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
      title="Retirement Savings Goal Calculator"
      description="Determine how much you need to save for retirement. Set clear goals based on your current age, income, and desired lifestyle."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Retirement Savings Goal Calculator" },
        { id: "formula", label: "Retirement Savings Goal Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P(1 + r)^n + PMT × (((1 + r)^n - 1) / r)",
        variables: [
          { symbol: "FV", description: "Future Value of Savings" },
          { symbol: "P", description: "Current Savings" },
          { symbol: "r", description: "Annual Rate of Return (as a decimal)" },
          { symbol: "n", description: "Number of Years to Retirement" },
          { symbol: "PMT", description: "Annual Contribution" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you are 30 years old with $50,000 in savings, planning to retire at 65. You contribute $6,000 annually with an expected return of 7%.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Calculate future value of current savings: $50,000 × (1 + 0.07)^35", 
            explanation: "Determine the growth of current savings over 35 years." 
          },
          { 
            label: "Step 2", 
            calculation: "Calculate future value of contributions: $6,000 × (((1 + 0.07)^35 - 1) / 0.07)", 
            explanation: "Determine the growth of annual contributions over 35 years." 
          },
          { 
            label: "Step 3", 
            calculation: "Total future savings = Step 1 result + Step 2 result", 
            explanation: "Combine both future values to get total savings at retirement." 
          }
        ],
        result: "The final result shows you will have approximately $1,000,000 at retirement, providing an annual income of $70,000 assuming a 7% return."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "📊" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}