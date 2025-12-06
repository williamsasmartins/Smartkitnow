import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const faqs = [
  {
    question: "How does a 401(k) work?",
    answer: "A 401(k) is a retirement savings plan sponsored by an employer. It lets workers save and invest a piece of their paycheck before taxes are taken out. Taxes aren't paid until the money is withdrawn from the account."
  },
  {
    question: "What is an employer match?",
    answer: "An employer match is essentially free money. Many employers will match a portion of your contributions to your 401(k), up to a certain percentage of your salary. Always try to contribute enough to get the full match."
  },
  {
    question: "What is the contribution limit for 401(k)?",
    answer: "The IRS sets annual contribution limits for 401(k) plans. For 2023, the limit is $22,500 for those under 50, and $30,000 for those 50 and older (including catch-up contributions). These limits are subject to change annually."
  },
  {
    question: "How does compound interest help my 401(k) grow?",
    answer: "Compound interest allows you to earn interest on your interest. Over time, this can significantly increase the value of your retirement savings, especially if you start early and contribute consistently."
  },
  {
    question: "Should I max out my 401(k)?",
    answer: "Maxing out your 401(k) is a great way to build retirement wealth and reduce your taxable income. However, you should also consider other financial goals, such as paying off high-interest debt or building an emergency fund."
  },
  {
    question: "What happens to my 401(k) if I change jobs?",
    answer: "If you change jobs, you can usually roll over your 401(k) into an IRA or your new employer's plan, or leave it with your old employer if allowed. Cashing it out is generally not recommended due to taxes and penalties."
  },
  {
    question: "Can I withdraw from my 401(k) early?",
    answer: "Generally, if you withdraw funds before age 59½, you will owe income taxes on the amount plus a 10% early withdrawal penalty. There are some exceptions, such as for certain hardships or first-time home purchases."
  },
  {
    question: "How does the annual growth rate affect my savings?",
    answer: "The annual growth rate is the estimated return on your investments. A higher growth rate leads to larger savings over time, but typically comes with higher risk. It's important to choose an investment mix that matches your risk tolerance."
  }
];

export default function RetirementSavingsGrowthCalculator() {
  const faqJsonLd = useFaqJsonLd(faqs);
  // STATE
  const [inputs, setInputs] = useState({ 
    initialBalance: "", 
    annualContribution: "", 
    employerMatch: "", 
    annualGrowthRate: "", 
    yearsToGrow: "" 
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
    let initialBalance = parseFloat(inputs.initialBalance) || 0;
    const annualContribution = parseFloat(inputs.annualContribution) || 0;
    const employerMatch = parseFloat(inputs.employerMatch) || 0;
    const annualGrowthRate = parseFloat(inputs.annualGrowthRate) / 100 || 0;
    const yearsToGrow = parseInt(inputs.yearsToGrow) || 0;

    // Validate
    if (initialBalance < 0 || annualContribution < 0 || employerMatch < 0 || annualGrowthRate < 0 || yearsToGrow <= 0) {
      return { 
        mainResult: 0, 
        totalContributions: 0, 
        totalGrowth: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    let balance = initialBalance;
    let totalContributions = 0;
    let totalGrowth = 0;
    const scheduleData = [];

    for (let year = 1; year <= yearsToGrow; year++) {
      const contribution = annualContribution + (annualContribution * employerMatch / 100);
      totalContributions += contribution;
      balance += contribution;
      const growth = balance * annualGrowthRate;
      totalGrowth += growth;
      balance += growth;

      scheduleData.push({
        year,
        contribution: formatCurrency(contribution),
        growth: formatCurrency(growth),
        balance: formatCurrency(balance)
      });
    }

    return { 
      mainResult: balance, 
      totalContributions, 
      totalGrowth, 
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
    setInputs({ initialBalance: "", annualContribution: "", employerMatch: "", annualGrowthRate: "", yearsToGrow: "" });
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
              Initial Balance
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.initialBalance}
              onChange={(e) => setInputs({ ...inputs, initialBalance: e.target.value })}
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
              Employer Match (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.employerMatch}
              onChange={(e) => setInputs({ ...inputs, employerMatch: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Annual Growth Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 7"
              value={inputs.annualGrowthRate}
              onChange={(e) => setInputs({ ...inputs, annualGrowthRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Years to Grow
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.yearsToGrow}
              onChange={(e) => setInputs({ ...inputs, yearsToGrow: e.target.value })}
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
                      Total Retirement Savings
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
                      Total Contributions
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalContributions)}
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
                      Total Growth
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalGrowth)}
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
                        <TableHead className="font-semibold">Contribution</TableHead>
                        <TableHead className="font-semibold">Growth</TableHead>
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
                            <TableCell>{row.contribution}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {row.growth}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {row.balance}
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
          Understanding 401(k) / Retirement Savings Growth Calculator
        </h2>
        
        <p className="mb-6">
          Planning for retirement is a critical aspect of financial management, and understanding how your savings will grow over time is essential. The 401(k) / Retirement Savings Growth Calculator is a powerful tool designed to help you estimate the future value of your retirement savings. By inputting key details such as your initial balance, annual contributions, employer match, and expected growth rate, you can visualize how your retirement nest egg will evolve over the years. This calculator is particularly useful for those who want to ensure they are on track to meet their retirement goals, providing a clear picture of potential future savings.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in retirement planning as they directly influence your financial security in later years. Misestimating your savings growth can lead to significant shortfalls, affecting your lifestyle post-retirement. According to financial experts, a common mistake is underestimating the impact of compound interest and employer matching contributions. This calculator helps mitigate such risks by providing precise estimates based on your inputs, allowing you to make informed decisions about your savings strategy. For more insights on managing your finances, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your current 401(k) balance, your annual contribution amount, the percentage your employer matches, and your expected annual growth rate. Enter these values into the respective fields to see how your savings will grow over time. It's important to use realistic assumptions for growth rates, typically ranging from 5% to 8% annually, depending on your investment strategy. For a comprehensive understanding of how different factors can affect your savings, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Remember, the earlier you start saving for retirement, the more time your money has to grow. Even small contributions can lead to significant savings over time due to the power of compounding interest. Ensure you maximize your employer's matching contributions to boost your savings effectively.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for optimizing your retirement savings include regularly reviewing your contribution levels and adjusting them as your income grows. Consider increasing your contributions whenever you receive a raise or bonus. Additionally, periodically reassess your investment strategy to ensure it aligns with your retirement goals and risk tolerance. For more strategies on financial optimization, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          401(k) / Retirement Savings Growth Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is based on the compound interest formula, which is a standard method for calculating the future value of an investment. The formula takes into account your initial balance, annual contributions, employer match, and the annual growth rate. This approach allows for a comprehensive estimation of your retirement savings over a specified period. Variations of this formula can be applied depending on specific scenarios, such as different contribution frequencies or growth rates.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          FV = P(1 + r)^n + C[((1 + r)^n - 1) / r]
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>P = Initial balance</li>
              <li>r = Annual growth rate (as a decimal)</li>
              <li>n = Number of years</li>
              <li>C = Annual contribution (including employer match)</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining the final savings amount. The initial balance (P) is your starting point, while the annual growth rate (r) reflects the expected increase in your investment value each year. The number of years (n) represents the time horizon for your investment, and the annual contribution (C) includes both your personal contributions and any employer matching. Adjusting these variables can significantly impact your retirement savings, highlighting the importance of strategic planning and regular reviews.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your retirement savings growth is crucial for effective planning. These factors interact in complex ways, and being aware of them can help you optimize your savings strategy. Here, we explore the primary elements that can impact your 401(k) growth.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Initial Balance
        </h3>
        <p className="mb-4">
          The initial balance is the amount you have in your 401(k) at the start of the calculation period. A higher initial balance provides a larger base for compound growth, which can significantly increase your total savings over time. For example, starting with $50,000 instead of $10,000 can result in a much larger nest egg due to the effects of compounding.
        </p>
        <p className="mb-6">
          To optimize your initial balance, consider rolling over any previous retirement accounts into your current 401(k) plan. This consolidation can enhance your growth potential by increasing the amount subject to compound interest. For more on managing initial balances, see our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Annual Contribution
        </h3>
        <p className="mb-4">
          Your annual contribution is a critical factor in building your retirement savings. Consistently contributing the maximum allowed by your plan can significantly boost your savings. For instance, contributing $6,000 annually with a 5% employer match can add up quickly, especially when combined with compound interest.
        </p>
        <p className="mb-6">
          It's important to review your contribution levels regularly and adjust them as your financial situation changes. Increasing your contributions by even a small percentage each year can have a substantial impact over time. For strategies on increasing contributions, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Employer Match
        </h3>
        <p className="mb-4">
          Employer matching is a valuable benefit that can significantly enhance your retirement savings. Many employers match a percentage of your contributions, effectively providing free money to boost your savings. For example, a 5% match on a $50,000 salary adds an extra $2,500 to your annual contributions.
        </p>
        <p className="mb-6">
          To maximize this benefit, ensure you contribute enough to receive the full match. Failing to do so is akin to leaving money on the table. For more on leveraging employer matches, consult our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Annual Growth Rate
        </h3>
        <p className="mb-6">
          The annual growth rate reflects the expected return on your investments. This rate can vary based on your investment strategy and market conditions. A higher growth rate can dramatically increase your savings, but it also comes with increased risk. For instance, a 7% growth rate over 30 years can more than double your savings compared to a 5% rate.
        </p>
        <p className="mb-6">
          It's crucial to choose a growth rate that aligns with your risk tolerance and retirement goals. Diversifying your investments can help manage risk while aiming for higher returns. For guidance on selecting growth rates, see our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Time Horizon
        </h3>
        <p className="mb-6">
          The time horizon is the period over which your investments will grow. A longer time horizon allows for more compounding periods, which can significantly increase your savings. For example, starting to save at age 25 instead of 35 can result in a much larger retirement fund due to the additional years of growth.
        </p>
        <p className="mb-6">
          Starting early is one of the most effective strategies for building substantial retirement savings. Even if you start with small contributions, the power of compounding over a long period can lead to impressive results. For more on the importance of time horizons, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
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
                href="https://www.fidelity.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Fidelity - Retirement Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive guides and tools for retirement planning and investment strategies.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.vanguard.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Vanguard - Retirement Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Offers insights and tools for managing retirement accounts and maximizing savings.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.schwab.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Charles Schwab - Retirement Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Provides educational resources and planning tools for retirement savings.
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
                Official guidelines and information on retirement plan contributions and tax implications.
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
                In-depth articles and tutorials on retirement planning and investment strategies.
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
                Offers practical advice and comparison tools for optimizing retirement savings.
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
      title="401(k) Retirement Savings Growth Calculator"
      description="Estimate the future value of your 401(k) based on contributions, employer match, and growth."
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "editorial", label: "Editorial" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      formula={{
        formula: "FV = P(1 + r)^n + C[((1 + r)^n - 1) / r]",
        variables: [
          { symbol: "P", description: "Initial balance" },
          { symbol: "r", description: "Annual growth rate (as a decimal)" },
          { symbol: "n", description: "Number of years" },
          { symbol: "C", description: "Annual contribution (including employer match)" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a starting balance of $50,000, contribute $6,000 annually, receive a 5% employer match, and expect a 7% annual growth rate over 30 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "6000 × 1.05 = 6300", 
            explanation: "Calculate the total annual contribution including employer match." 
          },
          { 
            label: "Step 2", 
            calculation: "6300 × 30 = 189000", 
            explanation: "Determine the total contributions over 30 years." 
          },
          { 
            label: "Step 3", 
            calculation: "50000(1 + 0.07)^30 + 189000[((1 + 0.07)^30 - 1) / 0.07]", 
            explanation: "Calculate the future value of the retirement savings." 
          }
        ],
        result: "The final result is approximately $1,000,000, meaning you will have a substantial retirement fund based on these assumptions."
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