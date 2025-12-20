import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EmergencyFundGoalCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    monthlyExpenses: "", 
    monthsToCover: "", 
    additionalBuffer: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // FAQ DATA
  const faqs = [
    {
      question: "What is an emergency fund goal calculator and why is it important?",
      answer: "An emergency fund goal calculator helps you determine the amount of savings needed to cover your expenses during unforeseen circumstances. It's important because it provides a financial safety net, ensuring you can maintain your lifestyle without incurring debt during emergencies. This tool is crucial for financial planning, helping you prepare for unexpected events like job loss or medical emergencies. For more on financial preparedness, explore our <a href='/financial/extra-payments-payoff' class='text-blue-600 dark:text-blue-400 hover:underline'>Extra Payments & Payoff Time Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "The calculator provides a reliable estimate based on the inputs you provide. However, its accuracy depends on the accuracy of your input data. Factors like fluctuating expenses or income changes can affect the results. It's advisable to regularly update your inputs to reflect your current financial situation for the most accurate results. For precise financial planning, consider consulting a financial advisor."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you'll need to know your average monthly expenses, the number of months you want your emergency fund to cover, and any additional buffer you wish to include. Monthly expenses should encompass all necessary costs such as rent, utilities, groceries, and transportation. The months to cover depend on your comfort level and financial stability. Gathering accurate data from your bank statements or budgeting apps can help ensure precise calculations."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, this calculator can be adapted for various scenarios, such as planning for a job transition, preparing for a new family member, or adjusting for seasonal income changes. However, it's essential to tailor the inputs to match the specific scenario you're planning for. Consider the unique expenses and timeframes associated with each situation. For more tailored financial planning, consult with a financial advisor who can provide personalized advice."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include underestimating monthly expenses, not accounting for irregular costs, and failing to update the fund as financial circumstances change. Additionally, some people forget to include a buffer for unexpected expenses, which can lead to insufficient savings during emergencies. To avoid these errors, regularly review and adjust your emergency fund based on current financial data and future projections."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's advisable to recalculate your emergency fund at least once a year or whenever significant life changes occur, such as a new job, marriage, or the birth of a child. Regular recalculations ensure your fund remains aligned with your current financial needs and goals. Keeping your fund updated helps maintain financial security and preparedness for unexpected events."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to set up or adjust your emergency fund. Transfer the calculated amount into a separate, easily accessible savings account dedicated to emergencies. This separation helps prevent the temptation to use the funds for non-emergencies. Regularly review your fund to ensure it remains adequate for your needs. For more on managing savings, explore our <a href='/financial/refinance-savings' class='text-blue-600 dark:text-blue-400 hover:underline'>Refinance Savings Calculator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives include using a percentage of your income as a savings target or setting a fixed amount based on past emergency experiences. Each method has its pros and cons, and the best choice depends on your financial situation and risk tolerance. Consider consulting with a financial advisor to explore different strategies and find the one that best suits your needs."
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
    const monthlyExpensesValue = parseFloat(inputs.monthlyExpenses) || 0;
    const monthsToCoverValue = parseFloat(inputs.monthsToCover) || 0;
    const additionalBufferValue = parseFloat(inputs.additionalBuffer) || 0;

    // Validate
    if (monthlyExpensesValue <= 0 || monthsToCoverValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const mainResult = monthlyExpensesValue * monthsToCoverValue;
    const result2 = mainResult + additionalBufferValue;
    const result3 = result2 * 1.1; // Adding a 10% buffer for unexpected expenses

    // Generate schedule data if applicable (e.g., savings schedule)
    const scheduleData = Array.from({ length: monthsToCoverValue }, (_, i) => ({
      month: i + 1,
      savingsGoal: mainResult / monthsToCoverValue,
      cumulativeSavings: (mainResult / monthsToCoverValue) * (i + 1),
      balance: mainResult - ((mainResult / monthsToCoverValue) * (i + 1))
    }));

    return { 
      mainResult, 
      result2, 
      result3, 
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
    setInputs({ monthlyExpenses: "", monthsToCover: "", additionalBuffer: "" });
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
              Monthly Expenses
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3000"
              value={inputs.monthlyExpenses}
              onChange={(e) => setInputs({ ...inputs, monthlyExpenses: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Months to Cover
            </Label>
            <Input
              type="number"
              placeholder="e.g., 6"
              value={inputs.monthsToCover}
              onChange={(e) => setInputs({ ...inputs, monthsToCover: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Additional Buffer
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.additionalBuffer}
              onChange={(e) => setInputs({ ...inputs, additionalBuffer: e.target.value })}
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
                      Total Emergency Fund Goal
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
                      Emergency Fund with Buffer
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.result2)}
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
                      Total with 10% Extra
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.result3)}
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
                    Savings Schedule
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
                        <TableHead className="font-semibold">Savings Goal</TableHead>
                        <TableHead className="font-semibold">Cumulative Savings</TableHead>
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
                            <TableCell>{formatCurrency(row.savingsGoal)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.cumulativeSavings)}
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
          Understanding Emergency Fund Goal Calculator
        </h2>
        
        <p className="mb-6">
          In today's unpredictable world, having a financial safety net is more important than ever. An emergency fund is a crucial part of any sound financial plan, providing a buffer against unexpected expenses such as medical emergencies, car repairs, or sudden unemployment. The Emergency Fund Goal Calculator is designed to help you determine the ideal size of your emergency fund, ensuring you have enough savings to cover your expenses for a specified period, typically between three to six months. This calculator takes into account your monthly expenses, the number of months you wish to cover, and any additional buffer you might want to include for unforeseen circumstances.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital when planning your emergency fund. Underestimating your needs could leave you vulnerable during financial hardships, while overestimating might unnecessarily tie up funds that could be used elsewhere. By using this calculator, you can make informed decisions about how much to save, ensuring your financial security without overextending your resources. This tool is particularly useful for those who are self-employed or have irregular income, as it helps smooth out financial uncertainties. For more insights on managing finances, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the Emergency Fund Goal Calculator effectively, start by gathering accurate information about your monthly expenses. This includes rent or mortgage payments, utilities, groceries, transportation, and any other regular expenses. Enter these values into the calculator along with the number of months you want your emergency fund to cover. You can also add an additional buffer for extra security. The calculator will then provide you with a detailed breakdown of your savings goal. For more detailed financial planning, consider using our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            It's essential to periodically review and adjust your emergency fund as your financial situation changes. Life events such as a new job, marriage, or the birth of a child can significantly impact your expenses and savings needs. Regularly updating your emergency fund goal ensures you remain prepared for whatever life throws your way.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for optimizing your emergency fund include setting realistic goals based on your current financial situation and regularly reviewing your expenses. Consider factors such as job stability, health, and lifestyle changes when determining the size of your fund. It's also wise to keep your emergency fund in a separate, easily accessible account to avoid the temptation of using it for non-emergencies. For more strategies on financial management, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Emergency Fund Goal Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Emergency Fund Goal Calculator is straightforward yet effective. It multiplies your average monthly expenses by the number of months you wish to cover, providing a baseline for your emergency fund. This approach ensures that you have enough savings to maintain your current lifestyle during periods of financial uncertainty. The formula can be adjusted to include additional buffers, allowing for extra security against unexpected costs.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Emergency Fund Goal = (Monthly Expenses × Months to Cover) + Additional Buffer
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Monthly Expenses = Total monthly costs for essentials</li>
              <li>Months to Cover = Desired number of months to cover</li>
              <li>Additional Buffer = Extra funds for unforeseen expenses</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the size of your emergency fund. Monthly Expenses should include all necessary costs such as housing, food, transportation, and healthcare. The Months to Cover variable reflects your comfort level and financial stability; a longer period provides more security but requires more savings. The Additional Buffer is optional but recommended for those with variable incomes or higher risk factors. Adjusting these variables allows you to tailor the fund to your specific needs and circumstances.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your emergency fund goal is crucial for accurate planning. These factors can vary widely based on individual circumstances and can significantly impact the amount you need to save. By considering these elements, you can ensure your emergency fund is both adequate and efficient.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Income Stability
        </h3>
        <p className="mb-4">
          Income stability is a primary factor in determining the size of your emergency fund. Those with stable, predictable incomes may require a smaller fund compared to freelancers or self-employed individuals who face income fluctuations. For example, a salaried employee might aim for three months of expenses, while a freelancer might target six months or more.
        </p>
        <p className="mb-6">
          To optimize your fund based on income stability, consider your job security and industry trends. If you're in a volatile industry, a larger fund can provide peace of mind. For more insights on managing variable income, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Monthly Expenses
        </h3>
        <p className="mb-4">
          Your monthly expenses are a direct input into the emergency fund calculation. It's essential to accurately account for all necessary expenses, including housing, utilities, food, transportation, and healthcare. Overlooking any of these can lead to an insufficient fund.
        </p>
        <p className="mb-6">
          Consider tracking your expenses over several months to get an accurate average. This practice not only helps in setting up your emergency fund but also aids in budgeting and financial planning. For more budgeting tools, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Lifestyle and Family Size
        </h3>
        <p className="mb-4">
          Lifestyle choices and family size significantly impact your emergency fund needs. A single individual may require less than a family of four, where expenses are naturally higher. Additionally, lifestyle choices such as travel, dining out, and entertainment can increase the required fund size.
        </p>
        <p className="mb-6">
          To manage this factor effectively, consider your current lifestyle and any planned changes, such as starting a family or purchasing a home. Adjust your fund accordingly to ensure it meets your needs. For more on planning for family changes, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Health and Insurance
        </h3>
        <p className="mb-6">
          Health status and insurance coverage are critical considerations when setting up an emergency fund. Those with chronic health conditions or inadequate insurance may need a larger fund to cover potential medical expenses. Conversely, comprehensive insurance can reduce the required fund size.
        </p>
        <p className="mb-6">
          Evaluate your health risks and insurance policies to determine the appropriate buffer for medical emergencies. This assessment can help you avoid financial strain during health crises. For more on managing health-related expenses, consider our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Broader economic conditions can also influence your emergency fund requirements. During economic downturns, job security may decrease, necessitating a larger fund. Conversely, in a strong economy, you might feel comfortable with a smaller reserve.
        </p>
        <p className="mb-6">
          Stay informed about economic trends and adjust your fund accordingly. This proactive approach ensures you're prepared for economic shifts that could impact your financial stability. For more on economic planning, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
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
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 space-y-3 prose dark:prose-invert max-w-none"
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
                Official data on economic trends and regulatory guidelines affecting financial planning.
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
                Consumer Financial Protection Bureau - Budgeting Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on budgeting.
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
                FDIC - Deposit Insurance Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information to secure your savings.
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
                Internal Revenue Service - Tax Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information relevant to financial planning.
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
                Detailed financial education and investment concepts explained for better planning.
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
                Personal finance guides and comparison tools for consumers to make informed decisions.
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
      title="Emergency Fund Goal Calculator"
      description="Calculate the ideal size for your emergency fund. Plan for 3 to 6 months of expenses to ensure financial security against the unexpected."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Emergency Fund Goal Calculator" },
        { id: "formula", label: "Emergency Fund Goal Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Emergency Fund Goal = (Monthly Expenses × Months to Cover) + Additional Buffer",
        variables: [
          { symbol: "Monthly Expenses", description: "Total monthly costs for essentials" },
          { symbol: "Months to Cover", description: "Desired number of months to cover" },
          { symbol: "Additional Buffer", description: "Extra funds for unforeseen expenses" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a monthly expense of $3,000 and want to cover 6 months with an additional buffer of $1,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "3000 × 6 = 18000", 
            explanation: "Calculate the base emergency fund for 6 months" 
          },
          { 
            label: "Step 2", 
            calculation: "18000 + 1000 = 19000", 
            explanation: "Add the additional buffer to the base fund" 
          },
          { 
            label: "Step 3", 
            calculation: "19000 × 1.1 = 20900", 
            explanation: "Include a 10% extra for unforeseen expenses" 
          }
        ],
        result: "The final result is $20,900, meaning you should aim to save this amount for your emergency fund."
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