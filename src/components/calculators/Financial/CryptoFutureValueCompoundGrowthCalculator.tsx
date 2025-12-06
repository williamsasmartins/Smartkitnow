import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CryptoFutureValueCompoundGrowthCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    annualInterestRate: "", 
    years: "" 
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
    let principal = parseFloat(inputs.initialInvestment) || 0;
    const annualRate = parseFloat(inputs.annualInterestRate) / 100 || 0;
    const time = parseFloat(inputs.years) || 0;

    // Validate
    if (principal <= 0 || annualRate <= 0 || time <= 0) {
      return { 
        futureValue: 0, 
        totalInterest: 0, 
        totalInvestment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const futureValue = principal * Math.pow((1 + annualRate), time);
    const totalInterest = futureValue - principal;
    const totalInvestment = principal + totalInterest;

    // Generate schedule data
    const scheduleData = Array.from({ length: time }, (_, i) => {
      const year = i + 1;
      const valueAtYear = principal * Math.pow((1 + annualRate), year);
      const interestAtYear = valueAtYear - principal;
      return {
        year,
        valueAtYear,
        interestAtYear,
        balance: valueAtYear
      };
    });

    return { 
      futureValue, 
      totalInterest, 
      totalInvestment, 
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
    setInputs({ initialInvestment: "", annualInterestRate: "", years: "" });
  };

  const faqs = [
    {
      question: "What is future value & compound growth estimator and why is it important?",
      answer: "The Future Value & Compound Growth Estimator is a tool that calculates the potential future value of an investment based on compound interest. It is crucial for investors looking to understand how their investments might grow over time, allowing them to make informed decisions about their financial strategies. By projecting future values, investors can plan for long-term goals such as retirement or major purchases. This estimator is particularly useful in volatile markets, where understanding potential outcomes can guide investment choices."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides a high level of accuracy based on the inputs provided, using a standard compound interest formula. However, the accuracy depends on the precision of the input values, such as the interest rate and investment duration. External factors like market changes and economic conditions can also affect the actual outcomes, so it's advisable to use this tool as a guide rather than a guarantee. For the best results, regularly update your inputs to reflect current market conditions and consult with financial advisors for personalized advice."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need the initial investment amount, the expected annual interest rate, and the number of years you plan to hold the investment. The initial investment is the starting amount you plan to invest. The annual interest rate should reflect realistic market conditions and can often be found in investment prospectuses or financial news. The investment duration is the period over which you expect to hold the investment. Ensure that these inputs are as accurate as possible to obtain reliable results."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, this calculator can be used for a variety of scenarios, including retirement planning, education savings, and long-term investment strategies. It is versatile and can accommodate different interest rates and investment durations. However, it may not account for specific factors such as taxes, fees, or inflation, which can affect the actual outcomes. For scenarios involving complex financial products or significant market volatility, consider consulting with a financial advisor to complement the insights provided by this tool."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using unrealistic interest rates, not accounting for fees or taxes, and ignoring inflation. These errors can lead to overestimating the future value of investments. Additionally, failing to update inputs regularly to reflect changes in market conditions or personal financial situations can result in inaccurate projections. To avoid these mistakes, ensure that your inputs are realistic and regularly reviewed. Consider external factors that might impact your investment and adjust your calculations accordingly."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculation should be done regularly, especially when there are significant changes in market conditions, interest rates, or personal financial goals. At a minimum, consider recalculating annually to ensure your projections remain accurate and relevant. Additionally, recalculate whenever you make changes to your investment strategy or when significant life events occur. Keeping your calculations up-to-date helps you stay informed and make timely adjustments to your investment plan, maximizing your financial outcomes."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to inform your investment strategy and financial planning. The projected future value can help you assess whether your current investment approach aligns with your long-term goals. If the results indicate that your investments may not meet your objectives, consider adjusting your strategy by increasing your investment amount, seeking higher interest rates, or extending your investment duration. For personalized advice, consult with a financial advisor who can provide tailored recommendations based on your unique financial situation."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives to the compound interest calculation include using simple interest formulas or financial modeling software for more complex scenarios. Simple interest calculations may be appropriate for short-term investments or loans, where interest is not compounded. Financial modeling software can provide more detailed projections by incorporating variables such as taxes, fees, and inflation. Each method has its pros and cons, and the choice depends on the complexity of your financial situation and your specific needs."
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
              placeholder="e.g., 5"
              value={inputs.annualInterestRate}
              onChange={(e) => setInputs({ ...inputs, annualInterestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Number of Years
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.years}
              onChange={(e) => setInputs({ ...inputs, years: e.target.value })}
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
      {results.futureValue > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Future Value
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.futureValue)}
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
                      Total Interest Earned
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalInterest)}
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
                      Total Investment Value
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalInvestment)}
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
                    Yearly Growth Schedule
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
                        <TableHead className="font-semibold">Value at Year</TableHead>
                        <TableHead className="font-semibold">Interest Earned</TableHead>
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
                            <TableCell>{formatCurrency(row.valueAtYear)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.interestAtYear)}
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
          Understanding Future Value & Compound Growth Estimator
        </h2>
        
        <p className="mb-6">
          Investing in cryptocurrencies can be a complex endeavor, especially when considering the potential growth over time. The Future Value & Compound Growth Estimator is designed to help investors project the future value of their crypto assets by taking into account compound growth. This tool is particularly useful for long-term holders who want to understand how their investments might grow over several years, given a specific annual percentage yield (APY). By inputting your initial investment, expected annual interest rate, and the number of years you plan to hold, you can gain insights into the potential future value of your assets.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the financial domain, as they can significantly impact your investment strategy and financial planning. Incorrect estimations might lead to poor investment decisions, potentially resulting in financial losses. This calculator uses a standard compound interest formula to ensure precise results, helping you make informed decisions about your crypto investments. For those interested in understanding how different interest rates and investment durations affect their financial outcomes, this tool is indispensable. Explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> for more financial insights.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your initial investment amount, the expected annual interest rate, and the duration of your investment in years. Enter these values into the respective fields, and the calculator will compute the future value of your investment. For the most accurate results, ensure that the interest rate is realistic and reflects current market conditions. Additionally, consider other factors that might influence your investment, such as market volatility and economic changes. For more detailed financial planning, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Remember, while the Future Value & Compound Growth Estimator provides valuable insights, it is based on assumptions about future interest rates and market conditions. Always consider diversifying your investments to mitigate risks associated with market volatility.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal use of this calculator, regularly update your inputs to reflect any changes in your investment strategy or market conditions. Keep in mind that external factors such as regulatory changes and technological advancements can also impact the growth of your crypto assets. By staying informed and adjusting your calculations accordingly, you can better manage your investment portfolio and achieve your financial goals.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Future Value & Compound Growth Estimator Formula
        </h2>
        
        <p className="mb-6">
          The Future Value & Compound Growth Estimator relies on the compound interest formula, a fundamental concept in finance used to calculate the growth of an investment over time. This formula considers the initial principal, the interest rate, and the number of compounding periods to determine the investment's future value. The formula is widely accepted due to its accuracy and ability to model real-world financial scenarios. Variations of this formula may include different compounding frequencies, such as monthly or quarterly, which can affect the final outcome.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          FV = P × (1 + r)^n
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>P = Initial principal (initial investment)</li>
              <li>r = Annual interest rate (as a decimal)</li>
              <li>n = Number of years</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          In this formula, 'P' represents the initial amount invested, 'r' is the annual interest rate expressed as a decimal, and 'n' is the number of years the investment is held. Each variable plays a crucial role in determining the future value. For instance, a higher interest rate or a longer investment period will result in a greater future value. Conversely, a lower interest rate or shorter duration will yield a smaller future value. Understanding these variables and their interactions can help investors make strategic decisions about their portfolios.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Several factors can influence the results of the Future Value & Compound Growth Estimator. Understanding these factors is essential for accurate projections and effective financial planning. Each factor interacts with others, creating a dynamic environment that can significantly impact your investment's growth.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Initial Investment Amount
        </h3>
        <p className="mb-4">
          The initial investment amount is the starting point of your financial journey. It represents the principal that will grow over time through compound interest. A larger initial investment typically results in a higher future value, assuming all other factors remain constant. For example, investing $10,000 at a 5% annual interest rate over 10 years will yield a greater future value than investing $5,000 under the same conditions.
        </p>
        <p className="mb-6">
          To optimize this factor, consider increasing your initial investment if possible. This can be achieved through savings or reallocating funds from less productive investments. Additionally, ensure that your initial investment aligns with your overall financial goals and risk tolerance. For more insights, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Annual Interest Rate
        </h3>
        <p className="mb-4">
          The annual interest rate is a critical determinant of your investment's growth. It represents the percentage increase in your investment each year. Higher interest rates lead to more significant growth, while lower rates result in slower accumulation. For instance, an investment with a 7% annual interest rate will grow faster than one with a 3% rate over the same period.
        </p>
        <p className="mb-6">
          Interest rates can vary based on market conditions and the type of investment. To maximize your returns, seek investments with competitive rates and consider diversifying your portfolio to include assets with varying risk levels. Keep an eye on economic indicators that might signal changes in interest rates. Explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> for more information on interest rates.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Duration
        </h3>
        <p className="mb-4">
          The length of time you hold your investment significantly impacts its future value. Longer investment durations allow more time for compound interest to work, resulting in greater growth. For example, an investment held for 20 years will generally have a higher future value than one held for only 5 years, assuming the same interest rate and initial investment.
        </p>
        <p className="mb-6">
          When planning your investment duration, consider your financial goals and liquidity needs. Longer durations may offer higher returns but require patience and a long-term commitment. Adjust your investment strategy as needed to accommodate changes in your financial situation or market conditions. For guidance on long-term financial planning, visit our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Compounding Frequency
        </h3>
        <p className="mb-6">
          Compounding frequency refers to how often interest is calculated and added to the principal. Common frequencies include annual, semi-annual, quarterly, and monthly compounding. More frequent compounding results in faster growth, as interest is calculated more often. For example, monthly compounding will yield a higher future value than annual compounding, given the same interest rate and duration.
        </p>
        <p className="mb-6">
          When selecting investments, consider the compounding frequency offered. Opt for investments with more frequent compounding to maximize growth. However, be aware that more frequent compounding may also come with higher risk or fees. Evaluate the trade-offs carefully to ensure they align with your financial objectives.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-6">
          Market volatility can affect the stability and predictability of your investment's growth. High volatility may lead to fluctuations in interest rates and asset values, impacting the future value of your investment. While volatility presents risks, it also offers opportunities for higher returns if managed effectively. Consider diversifying your portfolio to mitigate the impact of volatility and protect your investments.
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
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
                {faq.answer}
              </p>
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
                Access comprehensive data and analysis on economic trends and monetary policy.
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
                Explore resources and guides to enhance your financial literacy and decision-making.
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
                FDIC - Banking and Financial Services
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Learn about banking regulations, deposit insurance, and financial services.
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
                Access official tax guidelines, forms, and deduction information for individuals and businesses.
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
                Investopedia - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Explore detailed articles and tutorials on investment strategies and financial concepts.
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
                NerdWallet - Personal Finance Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Discover personal finance guides and comparison tools to help you make informed financial decisions.
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
      title="Future Value & Compound Growth Estimator"
      description="Estimate the future value of crypto assets with compound growth. Project long-term holding potential based on APY."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Future Value & Compound Growth Estimator" },
        { id: "formula", label: "Future Value & Compound Growth Estimator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P × (1 + r)^n",
        variables: [
          { symbol: "P", description: "Initial principal (initial investment)" },
          { symbol: "r", description: "Annual interest rate (as a decimal)" },
          { symbol: "n", description: "Number of years" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an initial investment of $5,000 with an annual interest rate of 5% over 10 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "5000 × (1 + 0.05)^10", 
            explanation: "Calculate the future value using the compound interest formula." 
          },
          { 
            label: "Step 2", 
            calculation: "5000 × 1.62889 = 8144.45", 
            explanation: "Determine the future value after 10 years." 
          },
          { 
            label: "Step 3", 
            calculation: "8144.45 - 5000 = 3144.45", 
            explanation: "Calculate the total interest earned over the period." 
          }
        ],
        result: "The final result is $8,144.45, meaning your investment has grown by $3,144.45 over 10 years."
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