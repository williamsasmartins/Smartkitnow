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
      question: "How accurate are Rule of 72 calculations and what limitations should I be aware of?",
      answer: "This calculator provides estimates based on the inputs you provide. For Rule of 72, accuracy depends on using current compound interest data -- rates, prices, and regulatory thresholds change frequently. The results are most reliable for planning purposes and comparative analysis. For financial decisions involving significant amounts, verify results against official sources or consult a compound interest professional."
    },
    {
      question: "What key factors most affect Rule of 72 results?",
      answer: "The most impactful variables in Rule of 72 calculations are typically the primary rate or percentage input and the time horizon. Small changes in these variables compound significantly over longer periods. For example, a 1% difference in return rate over 20 years can change outcomes by 20–30%. Always run the calculation at multiple input values to understand your sensitivity to each variable."
    },
    {
      question: "When should I recalculate Rule of 72?",
      answer: "Recalculate whenever compound interest conditions change significantly: after major compound interest events, when your inputs change (income, rates, holdings), or when compound interest regulations are updated. For time-sensitive compound interest metrics, recalculate monthly. For long-term planning tools, a quarterly review is typically sufficient. Set a calendar reminder to revisit projections annually at minimum."
    },
    {
      question: "How does Rule of 72 relate to other financial planning metrics?",
      answer: "No single metric tells the complete financial picture. Rule of 72 should be evaluated alongside related measures like doubling time. These metrics interact: improving one often affects another. Build a dashboard of 3–5 key metrics that together reflect the health of your compound interest situation, rather than optimizing any single number in isolation."
    },
    {
      question: "What are the most common mistakes when calculating Rule of 72?",
      answer: "The most frequent errors in Rule of 72 calculations: (1) Using pre-tax instead of post-tax figures where after-tax analysis is needed, (2) Ignoring fees and transaction costs that reduce net returns, (3) Using nominal figures without inflation adjustment for long-horizon projections, (4) Assuming constant rates -- real-world compound interest conditions fluctuate. Double-check your inputs against current compound interest data before relying on results for significant financial decisions."
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Rule of 72 Calculator
        </h2>
        
        <p className="mb-6">
          The Rule of 72 is a simplified way to estimate the number of years required to double the invested money at a given annual rate of return. This calculator is designed to provide a quick and easy way to perform this calculation, making it an invaluable tool for investors who want to understand the potential growth of their investments over time. Whether you're planning for retirement, saving for a major purchase, or simply curious about your investment's future, this calculator can help you make informed decisions.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the financial world, as they can significantly impact your investment strategy and financial planning. Incorrect calculations can lead to poor investment decisions, resulting in financial losses or missed opportunities. By using this Rule of 72 Calculator, you can ensure that your estimates are based on sound mathematical principles, allowing you to plan confidently and strategically. For more detailed financial planning, consider using our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, you'll need to gather some basic information about your investment. Start by entering the initial amount of your investment and the expected annual interest rate. The calculator will then use the Rule of 72 to estimate how many years it will take for your investment to double. For the most accurate results, ensure that the interest rate reflects the average annual return you expect to achieve. For more insights, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Remember, the Rule of 72 is an approximation and works best for interest rates between 6% and 10%. For interest rates outside this range, the results may be less accurate. Always consider using a more detailed financial model for precise planning.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your interest rate to reflect current market conditions and considering the impact of taxes and fees on your investment returns. Additionally, be aware of external factors such as economic changes that could affect your investment's performance. For more tips, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Rule of 72 Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Rule of 72 is a straightforward mathematical formula used to estimate the number of years required to double an investment at a fixed annual rate of interest. The formula is expressed as:
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Years to Double = 72 / Interest Rate
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Interest Rate = The annual interest rate expressed as a percentage</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          In this formula, the number 72 is a constant that provides a quick approximation of the doubling time. The interest rate should be expressed as a percentage (e.g., 6 for 6%). This formula is widely used due to its simplicity and ease of use, making it a popular choice for quick mental calculations. However, it's important to note that the Rule of 72 is an approximation and may not be precise for all interest rates.
        </p>
        <p className="mb-4">
          The Rule of 72 is most accurate for interest rates between 6% and 10%. For rates outside this range, the approximation may become less accurate, and a more detailed financial analysis may be necessary. Despite its limitations, the Rule of 72 remains a valuable tool for investors seeking a quick estimate of investment growth.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence the results of the Rule of 72 calculation is crucial for making informed investment decisions. These factors can significantly impact the accuracy and applicability of the results.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is the most critical factor in the Rule of 72 calculation. It determines how quickly your investment will grow over time. Higher interest rates result in shorter doubling periods, while lower rates extend the time required to double your investment. For example, an interest rate of 8% will double an investment in approximately 9 years, while a 4% rate will take about 18 years.
        </p>
        <p className="mb-6">
          It's essential to use a realistic interest rate that reflects your investment's expected performance. Consider factors such as market conditions, historical performance, and economic forecasts when determining the appropriate rate. For more detailed analysis, you might want to explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Duration
        </h3>
        <p className="mb-4">
          The duration of your investment also plays a significant role in the Rule of 72 calculation. While the formula provides an estimate of the time required to double your investment, actual results may vary based on the investment's lifespan. Short-term investments may not fully realize the benefits of compound interest, while long-term investments can significantly increase wealth due to compounding effects.
        </p>
        <p className="mb-6">
          Consider your financial goals and time horizon when using the Rule of 72. Longer investment durations generally lead to greater wealth accumulation, but they also require patience and discipline. For more insights, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Market volatility can impact the accuracy of the Rule of 72 calculation. Fluctuations in market conditions can lead to variations in interest rates, affecting the time required to double your investment. During periods of high volatility, it's essential to remain cautious and consider the potential impact on your investment strategy.
        </p>
        <p className="mb-6">
          Diversifying your portfolio and maintaining a long-term perspective can help mitigate the effects of market volatility. Regularly reviewing and adjusting your investment strategy can also ensure that you remain on track to achieve your financial goals.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Inflation
        </h3>
        <p className="mb-6">
          Inflation is another critical factor that can influence the results of the Rule of 72 calculation. As inflation erodes purchasing power, it can affect the real value of your investment returns. When using the Rule of 72, it's important to consider the impact of inflation on your investment's growth.
        </p>
        <p className="mb-6">
          To account for inflation, consider using a real interest rate, which adjusts the nominal rate for inflation. This approach provides a more accurate estimate of your investment's growth in terms of purchasing power. For more information on managing inflation, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Implications
        </h3>
        <p className="mb-6">
          Taxes can also impact the results of the Rule of 72 calculation. Depending on your investment type and tax bracket, taxes can reduce your effective interest rate, extending the time required to double your investment. Understanding the tax implications of your investments is crucial for accurate financial planning.
        </p>
        <p className="mb-6">
          Consider consulting with a tax professional to understand how taxes may affect your investment strategy. By optimizing your tax situation, you can potentially increase your investment returns and achieve your financial goals more efficiently.
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
                Explore comprehensive economic data and research provided by the Federal Reserve.
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
                Consumer Financial Protection Bureau - Investment Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access educational resources and guides on managing investments and personal finance.
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
                Internal Revenue Service - Tax Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and information on deductions from the IRS.
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
                Detailed explanations of financial concepts and investment strategies.
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
                Personal finance guides and comparison tools for making informed financial decisions.
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
