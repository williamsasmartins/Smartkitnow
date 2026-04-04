import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function SavingsRateTrackerCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    income: "", 
    expenses: "", 
    savings: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is a good savings rate and how does it affect retirement timeline?",
      answer: "Research by Mr. Money Mustache (popularized in personal finance communities) based on the 4% safe withdrawal rate: at a 10% savings rate, retirement takes ~46 years. At 20%: ~37 years. At 50%: ~17 years. At 75%: ~7 years. Every percentage point increase in savings rate accelerates retirement timeline exponentially because you simultaneously: (1) invest more, growing the portfolio faster, and (2) reduce spending, decreasing the portfolio size needed for retirement. The US personal savings rate was 3.6% in 2024 (BEA), far below the 15–20% recommended by most financial advisors. The median 401k balance for 55–64 year olds is $185,000 -- insufficient for most retirements."
    },
    {
      question: "Should I include employer 401k contributions in my savings rate calculation?",
      answer: "Including employer match gives the most economically accurate picture; excluding it gives the behavioral picture (what you personally sacrifice). Both metrics are useful. Example: earn $80,000, save $8,000 personally (10% personal rate), employer matches $4,000 = $12,000 total. Total savings rate = 15%. Personal savings rate = 10%. For benchmarking your own behavior: use personal rate. For estimating retirement timeline: use total rate (all sources going to long-term savings). Also consider: HSA contributions are effectively additional savings (triple tax advantage, can be used for healthcare in retirement). Include HSA in total savings rate, not in personal spending budget."
    },
    {
      question: "How do I calculate my true savings rate including all forms of savings?",
      answer: "True savings rate = (total savings) / (gross income). Total savings includes: 401k/403b contributions (yours + employer), IRA contributions, taxable brokerage additions, 529 contributions, HSA contributions, extra mortgage principal payments, any increase in savings account balance. Gross income: use pre-tax income (not take-home) to avoid inflating the rate. Example: $100,000 gross, $6,000 401k + $2,400 employer match + $7,000 IRA + $1,200 HSA + $3,400 brokerage = $20,000 saved. Savings rate = 20%. Tracking this monthly in a spreadsheet (or tool like YNAB, Monarch) reveals trends: did your savings rate drop because expenses increased or income decreased? The direction matters for corrective action."
    },
    {
      question: "How much does a 1% increase in savings rate actually impact long-term wealth?",
      answer: "On $80,000 income, 1% more savings = $800/year. At 7% over 30 years: $800/year grows to $81,272. That $800/year habit creates $81,272 in additional wealth. For a 2% increase ($1,600/year): $162,544. The key insight: at the time of the decision, $800/year feels trivial ($67/month). At retirement, it represents $81,272. Every percentage point of savings rate corresponds roughly to 1–1.5 months of earlier retirement eligibility (at 10–15% base savings rate). Automating savings increases ensures the behavioral change actually happens -- setting a recurring transfer the day after payday, before spending temptation."
    },
    {
      question: "What is the FIRE movement's savings rate target and is it realistic for most people?",
      answer: "FIRE (Financial Independence, Retire Early) typically targets 50–70% savings rates for retirement in 10–17 years. This requires: high income (dual-income households earning $150K+ combined), radical frugality, or geographic arbitrage (geoarbitrage to low cost-of-living areas). Is it realistic? For the median US household ($74,580 income, 2024): after taxes, housing, food, healthcare, and transportation, reaching 50%+ savings requires near-elimination of discretionary spending and/or significantly below-average housing costs. Lean FIRE (minimal spending in retirement on ~$40K/year, $1M portfolio) is more accessible than Fat FIRE ($100K+/year, $2.5M portfolio). The most realistic FIRE adaptation for median earners: 25–35% savings rate targeting 25–30 year horizons."
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
    const incomeValue = parseFloat(inputs.income) || 0;
    const expensesValue = parseFloat(inputs.expenses) || 0;
    const savingsValue = parseFloat(inputs.savings) || 0;

    // Validate
    if (incomeValue <= 0) {
      return { 
        savingsRate: 0, 
        totalSavings: 0, 
        totalExpenses: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const totalSavings = savingsValue;
    const totalExpenses = expensesValue;
    const savingsRate = (totalSavings / incomeValue) * 100;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      savings: totalSavings / 12,
      expenses: totalExpenses / 12,
      balance: incomeValue - ((totalSavings + totalExpenses) / 12) * (i + 1)
    }));

    return { 
      savingsRate, 
      totalSavings, 
      totalExpenses, 
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
    setInputs({ income: "", expenses: "", savings: "" });
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
              Monthly Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={inputs.income}
              onChange={(e) => setInputs({ ...inputs, income: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Monthly Expenses
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3000"
              value={inputs.expenses}
              onChange={(e) => setInputs({ ...inputs, expenses: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Monthly Savings
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.savings}
              onChange={(e) => setInputs({ ...inputs, savings: e.target.value })}
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
      {results.savingsRate > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Savings Rate
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.savingsRate.toFixed(2)}%
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
                      Total Savings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalSavings)}
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
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalExpenses)}
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
                    Monthly Breakdown
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
                        <TableHead className="font-semibold">Savings</TableHead>
                        <TableHead className="font-semibold">Expenses</TableHead>
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
                            <TableCell>{formatCurrency(row.savings)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.expenses)}
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Savings Rate Tracker
        </h2>
        
        <p className="mb-6">
          The Savings Rate Tracker is an essential tool for anyone looking to gain a clearer understanding of their financial health. By calculating the percentage of your income that is saved versus spent, you can make informed decisions about your financial future. This tool is particularly useful for individuals aiming to improve their savings habits, plan for retirement, or simply gain better control over their finances. Whether you're saving for a specific goal or just trying to build a safety net, knowing your savings rate is crucial.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in financial planning. A miscalculation could lead to overspending or under-saving, both of which can have significant long-term effects. For instance, underestimating your expenses might leave you without enough funds for emergencies, while overestimating your savings could result in missed investment opportunities. This calculator helps ensure that you have a realistic view of your financial situation, allowing you to make adjustments as needed. For more insights on financial planning, you might find our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> useful.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather all necessary information beforehand. You'll need your total monthly income, monthly expenses, and the amount you save each month. Enter these values into the respective fields to calculate your savings rate. This tool will provide you with a percentage that represents how much of your income is being saved. For additional guidance, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Regularly tracking your savings rate can help you identify spending patterns and areas where you can cut back. This insight is invaluable for setting realistic financial goals and ensuring long-term financial stability.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs to reflect changes in income or expenses. It's also beneficial to compare your current savings rate with past rates to track your progress over time. Keep in mind that factors such as unexpected expenses or income changes can affect your results.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Savings Rate Tracker Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Savings Rate Tracker is straightforward yet powerful. It calculates your savings rate by dividing your total savings by your total income, then multiplying by 100 to convert it into a percentage. This formula is widely accepted in financial planning due to its simplicity and effectiveness in providing a clear picture of one's financial health.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Savings Rate (%) = (Total Savings / Total Income) × 100
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Total Savings = Amount saved each month</li>
              <li>Total Income = Total monthly income</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in this formula plays a crucial role. Total Savings represents the amount you set aside each month, which directly impacts your financial security. Total Income is the sum of all earnings, which provides the context for your savings rate. A higher savings rate indicates a stronger financial position, while a lower rate may suggest the need for adjustments in spending or saving habits.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your savings rate is essential for accurate financial planning. These factors can vary widely and may interact with each other in complex ways, affecting your overall financial health.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Income Stability
        </h3>
        <p className="mb-4">
          Income stability is a critical factor in determining your savings rate. A steady income allows for consistent savings, while fluctuations can make it challenging to maintain a regular savings habit. For example, freelancers or those with variable income may find it harder to predict their savings rate accurately.
        </p>
        <p className="mb-6">
          To optimize this factor, consider setting a baseline savings amount that you can achieve even during low-income months. This approach ensures that you continue to save regardless of income fluctuations. For more strategies, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Expense Management
        </h3>
        <p className="mb-4">
          Effective expense management is crucial for maintaining a healthy savings rate. High expenses can significantly reduce the amount available for savings, impacting your financial goals. Tracking and categorizing expenses can help identify areas where you can cut back.
        </p>
        <p className="mb-6">
          Consider using budgeting tools to monitor your spending and adjust as necessary. Reducing discretionary spending can free up more funds for savings, enhancing your financial security.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Savings Goals
        </h3>
        <p className="mb-4">
          Having clear savings goals can motivate you to maintain or increase your savings rate. Whether saving for a vacation, a new home, or retirement, specific goals provide direction and purpose for your savings efforts.
        </p>
        <p className="mb-6">
          To manage this factor effectively, set realistic and achievable goals. Break larger goals into smaller, manageable milestones to track your progress and stay motivated.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Inflation and Economic Conditions
        </h3>
        <p className="mb-6">
          Inflation and economic conditions can affect your savings rate by influencing both income and expenses. Rising inflation may increase living costs, reducing the amount available for savings. Conversely, a strong economy might lead to higher income and increased savings potential.
        </p>
        <p className="mb-6">
          Staying informed about economic trends can help you anticipate changes and adjust your savings strategy accordingly. Consider consulting financial advisors for personalized advice.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Lifestyle Choices
        </h3>
        <p className="mb-6">
          Lifestyle choices, such as living arrangements and spending habits, can significantly impact your savings rate. Opting for a modest lifestyle can increase the amount available for savings, while extravagant spending may hinder your financial goals.
        </p>
        <p className="mb-6">
          Evaluate your lifestyle choices and consider adjustments that align with your financial objectives. Simple changes, like dining out less frequently or choosing more affordable housing, can make a substantial difference in your savings rate.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
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
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3"
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
                Official data on economic conditions and regulatory guidelines.
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
                Consumer Financial Protection Bureau - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources.
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
                FDIC - Banking Regulations
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information.
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
                Internal Revenue Service - Tax Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information.
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
                Investopedia - Financial Concepts
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained.
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
                NerdWallet - Personal Finance Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers.
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
      title="Savings Rate Tracker"
      description="Track your personal savings rate. Determine exactly what percentage of your income you are saving for the future versus spending."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Savings Rate Tracker" },
        { id: "formula", label: "Savings Rate Tracker Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Savings Rate (%) = (Total Savings / Total Income) × 100",
        variables: [
          { symbol: "Total Savings", description: "Amount saved each month" },
          { symbol: "Total Income", description: "Total monthly income" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a monthly income of $5,000, expenses of $3,000, and savings of $1,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Savings Rate = (1000 / 5000) × 100", 
            explanation: "Calculate the percentage of income saved." 
          },
          { 
            label: "Step 2", 
            calculation: "Savings Rate = 20%", 
            explanation: "The result shows that 20% of your income is saved." 
          }
        ],
        result: "The final result is 20%, meaning you save 20% of your income."
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
