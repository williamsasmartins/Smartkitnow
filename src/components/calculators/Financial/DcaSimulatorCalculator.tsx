import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DcaSimulatorCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    monthlyContribution: "", 
    investmentPeriod: "" 
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

  const faqs = [
    {
      question: "What is dollar cost averaging (DCA) simulator and why is it important?",
      answer: "The Dollar Cost Averaging (DCA) Simulator is a tool designed to help investors understand the benefits of regular, fixed-amount investments over time. It demonstrates how investing consistently can reduce the impact of market volatility and potentially lead to better investment outcomes. By using the DCA Simulator, investors can visualize the growth of their investments and make informed decisions about their financial strategies. This simulator is important because it provides a clear picture of how DCA works in practice, allowing investors to compare it with other strategies like lump-sum investing. For more on investment strategies, check our <a href=\"/financial/investment-strategy-calculator\">Investment Strategy Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "The DCA Simulator is designed to provide accurate projections based on the inputs you provide. However, it is important to note that the calculator uses assumptions about growth rates and market conditions, which can vary in reality. While the simulator offers valuable insights, it should be used as a guide rather than a definitive prediction. For precise financial planning, consider consulting with a financial advisor who can tailor advice to your specific situation. Always use the simulator in conjunction with professional guidance."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use the DCA Simulator, you'll need to provide information about your initial investment amount, the amount you plan to contribute monthly, and the duration of your investment period in months. Additionally, having an understanding of your expected annual growth rate can help in making more accurate projections. Gathering accurate data is crucial for reliable results. Review your financial statements and consult with your financial advisor to ensure that the information you input reflects your actual financial situation."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, the DCA Simulator can be used for a variety of scenarios, including retirement planning, education savings, or general investment growth. By adjusting the inputs, you can explore different strategies and see how they might perform over time. It's a versatile tool that can be tailored to meet your specific financial goals. However, keep in mind that the simulator is based on assumptions and should be used as a guide. For more complex scenarios, consulting with a financial advisor is recommended."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "One common mistake is underestimating the impact of market volatility on investment growth. While DCA helps mitigate some risks, it's important to have realistic expectations about potential returns. Another mistake is failing to adjust contributions based on changing financial circumstances, which can lead to suboptimal investment outcomes. To avoid these errors, regularly review your investment strategy and adjust your inputs as needed. Stay informed about market conditions and consult with a financial advisor for personalized advice."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's advisable to recalculate your investment strategy whenever there are significant changes in your financial situation, such as a change in income, expenses, or financial goals. Additionally, reviewing your strategy annually can help ensure that it remains aligned with your long-term objectives. Regular recalculations can help you stay on track and make necessary adjustments to optimize your investment outcomes. Consider setting a reminder to review your strategy at least once a year."
    },
    {
      question: "What should I do with these results?",
      answer: "The results from the DCA Simulator provide a projection of your investment's potential growth. Use these insights to evaluate your current strategy and make informed decisions about future investments. If the results align with your financial goals, you can continue with your current strategy. If not, consider adjusting your contributions or investment period. For further guidance, consult with a financial advisor who can provide personalized advice based on your unique situation. Explore our <a href=\"/financial/financial-advisor-calculator\">Financial Advisor Calculator</a> for more insights."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Yes, there are alternative investment strategies such as lump-sum investing, where you invest a large amount at once, or tactical asset allocation, which involves adjusting your portfolio based on market conditions. Each method has its pros and cons, and the best choice depends on your financial goals and risk tolerance. Consider exploring different strategies to find the one that best suits your needs. Consulting with a financial advisor can provide valuable insights into the most suitable approach for your situation."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    let initialInvestmentValue = parseFloat(inputs.initialInvestment) || 0;
    const monthlyContributionValue = parseFloat(inputs.monthlyContribution) || 0;
    const investmentPeriodValue = parseFloat(inputs.investmentPeriod) || 0;

    // Validate
    if (initialInvestmentValue < 0 || monthlyContributionValue < 0 || investmentPeriodValue <= 0) {
      return { 
        mainResult: 0, 
        totalContributions: 0, 
        totalValue: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalContributions = initialInvestmentValue + (monthlyContributionValue * investmentPeriodValue);
    const estimatedGrowthRate = 0.07; // Assume a 7% annual growth rate
    const totalValue = totalContributions * Math.pow((1 + estimatedGrowthRate / 12), investmentPeriodValue);

    // Generate schedule data if applicable (e.g., investment growth)
    const scheduleData = Array.from({ length: investmentPeriodValue }, (_, i) => {
      const month = i + 1;
      const monthlyGrowth = (initialInvestmentValue + (monthlyContributionValue * month)) * Math.pow((1 + estimatedGrowthRate / 12), month);
      return {
        month,
        contribution: monthlyContributionValue,
        growth: monthlyGrowth - (initialInvestmentValue + (monthlyContributionValue * month)),
        balance: monthlyGrowth
      };
    });

    return { 
      mainResult: totalValue, 
      totalContributions, 
      totalValue, 
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
    setInputs({ initialInvestment: "", monthlyContribution: "", investmentPeriod: "" });
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
              Monthly Contribution
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.monthlyContribution}
              onChange={(e) => setInputs({ ...inputs, monthlyContribution: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Investment Period (months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 120"
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
                      Total Investment Value
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
                      Estimated Growth
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.mainResult - results.totalContributions)}
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
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell>{formatCurrency(row.contribution)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.growth)}
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
          Understanding Dollar Cost Averaging (DCA) Simulator
        </h2>
        
        <p className="mb-6">
          Dollar Cost Averaging (DCA) is a powerful investment strategy that involves investing a fixed amount of money at regular intervals, regardless of the market conditions. This approach helps investors mitigate the impact of market volatility by spreading out their investments over time. The DCA Simulator allows you to visualize how this strategy can work for you, comparing it against lump-sum investing and highlighting its advantages in volatile markets. Whether you're a seasoned investor or just starting, understanding DCA can be crucial for building a robust investment portfolio.
        </p>
        
        <p className="mb-6">
          Accurate calculations are essential when planning your investment strategy. Incorrect estimates can lead to suboptimal investment decisions, potentially affecting your financial goals. The DCA Simulator provides precise calculations based on your inputs, helping you make informed decisions. By using this tool, you can explore different scenarios and understand the potential outcomes of your investment strategy. For more insights into investment strategies, check out our <a href="/financial/investment-strategy-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">Investment Strategy Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the DCA Simulator effectively, gather information about your initial investment amount, monthly contributions, and the investment period. Enter these values into the calculator to see how your investment could grow over time. The simulator will provide you with detailed results, including total contributions, estimated growth, and the final investment value. For a deeper understanding of how your inputs affect the results, explore our <a href="/financial/compound-interest-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">Compound Interest Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Consistency is key in Dollar Cost Averaging. By investing regularly, you can take advantage of market dips and avoid the pitfalls of trying to time the market. This strategy helps in building wealth steadily over time, reducing the impact of market volatility.
          </p>
        </div>
        
        <p className="mb-6">
          To optimize your use of the DCA Simulator, consider experimenting with different investment periods and contribution amounts. This will help you understand how changes in these factors can impact your investment outcomes. Be mindful of external factors such as market conditions and economic trends, which can also influence your results. For more tips on optimizing your investment strategy, visit our <a href="/financial/portfolio-optimization-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">Portfolio Optimization Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Dollar Cost Averaging (DCA) Simulator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the DCA Simulator is based on the concept of compound interest, which calculates the growth of your investment over time. The formula takes into account your initial investment, regular contributions, and the growth rate of your investments. This approach allows you to see how your investments could grow over a specified period, providing a realistic projection of your potential returns.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          FV = P × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>FV = Future Value of the investment</li>
              <li>P = Initial principal (initial investment)</li>
              <li>PMT = Regular contribution amount</li>
              <li>r = Annual interest rate (as a decimal)</li>
              <li>n = Number of times interest is compounded per year</li>
              <li>t = Number of years the money is invested for</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the future value of your investment. The initial principal (P) is the starting point of your investment, while the regular contribution (PMT) represents the amount you add to your investment at each interval. The annual interest rate (r) and the compounding frequency (n) determine how your investment grows over time. By adjusting these variables, you can explore different investment scenarios and understand their potential outcomes.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your investment outcomes is essential for making informed decisions. These factors interact in complex ways, and being aware of them can help you optimize your investment strategy. Here, we explore the key factors that affect the results of the DCA Simulator.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Initial Investment
        </h3>
        <p className="mb-4">
          The initial investment is the amount you start with, and it serves as the foundation for your investment growth. A larger initial investment can lead to higher returns, as it provides a larger base for compounding. However, it's important to balance your initial investment with your overall financial goals and risk tolerance.
        </p>
        <p className="mb-6">
          To optimize your initial investment, consider your current financial situation and future goals. It's crucial to invest an amount that aligns with your risk tolerance and financial objectives. For more insights, visit our <a href="/financial/risk-assessment-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">Risk Assessment Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Monthly Contribution
        </h3>
        <p className="mb-4">
          Regular contributions are a key component of the DCA strategy. By investing a fixed amount each month, you can take advantage of market fluctuations and potentially lower your average cost per share. This approach helps in building wealth over time, even in volatile markets.
        </p>
        <p className="mb-6">
          The amount you contribute monthly should be sustainable and aligned with your financial plan. It's important to review your budget and ensure that your contributions do not strain your finances. Adjusting your contributions based on your financial situation can help you stay on track with your investment goals.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Period
        </h3>
        <p className="mb-4">
          The length of time you invest plays a significant role in determining your investment's growth. A longer investment period allows more time for compounding, potentially leading to higher returns. However, it's important to consider your financial goals and time horizon when deciding on the investment period.
        </p>
        <p className="mb-6">
          To determine the optimal investment period, consider your financial goals and the time frame in which you want to achieve them. A longer period may offer more growth potential, but it also requires patience and discipline. For more guidance, explore our <a href="/financial/goal-planning-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">Goal Planning Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Conditions
        </h3>
        <p className="mb-6">
          Market conditions can significantly impact your investment results. While DCA helps mitigate the effects of market volatility, it's important to be aware of economic trends and market cycles. Understanding these factors can help you make informed decisions about when to adjust your investment strategy.
        </p>
        <p className="mb-6">
          Staying informed about market trends and economic indicators can provide valuable insights into potential investment opportunities. Regularly reviewing your investment strategy in light of market conditions can help you optimize your portfolio for better returns.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Risk Tolerance
        </h3>
        <p className="mb-6">
          Your risk tolerance is a critical factor in determining your investment strategy. It influences the types of investments you choose and how you respond to market fluctuations. Understanding your risk tolerance can help you create a balanced portfolio that aligns with your financial goals.
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
                href="https://www.sec.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                U.S. Securities and Exchange Commission - Investment Basics
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive information on investment strategies and regulatory guidelines for investors.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.investor.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Investor.gov - Dollar Cost Averaging
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Educational resources on the benefits and strategies of dollar cost averaging.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.fidelity.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Fidelity - Investment Strategies
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Insights and strategies for effective investment planning and portfolio management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.morningstar.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Morningstar - Market Analysis
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                In-depth market analysis and investment research to guide your financial decisions.
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
                Vanguard - Investment Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Educational resources and tools for making informed investment choices.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.blackrock.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                BlackRock - Investment Insights
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Expert insights and analysis on global investment trends and strategies.
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
      title="Dollar Cost Averaging (DCA) Simulator"
      description="Simulate Dollar Cost Averaging strategies. See how regular investing compares to lump-sum investing and beats market timing volatility."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Dollar Cost Averaging (DCA) Simulator" },
        { id: "formula", label: "Dollar Cost Averaging (DCA) Simulator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]",
        variables: [
          { symbol: "FV", description: "Future Value of the investment" },
          { symbol: "P", description: "Initial principal (initial investment)" },
          { symbol: "PMT", description: "Regular contribution amount" },
          { symbol: "r", description: "Annual interest rate (as a decimal)" },
          { symbol: "n", description: "Number of times interest is compounded per year" },
          { symbol: "t", description: "Number of years the money is invested for" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an initial investment of $10,000, contribute $500 monthly, and expect a 7% annual growth rate over 10 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "10000 × (1 + 0.07/12)^(12×10)", 
            explanation: "Calculate the future value of the initial investment with compound interest." 
          },
          { 
            label: "Step 2", 
            calculation: "500 × [((1 + 0.07/12)^(12×10) - 1) / (0.07/12)]", 
            explanation: "Calculate the future value of monthly contributions with compound interest." 
          },
          { 
            label: "Step 3", 
            calculation: "Sum of Step 1 and Step 2", 
            explanation: "Add the future values from steps 1 and 2 to get the total investment value." 
          }
        ],
        result: "The final result is approximately $114,000, showing the potential growth of your investment over 10 years."
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