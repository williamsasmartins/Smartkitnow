import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function HourlyToAnnualSalaryCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hourlyRate: "", 
    hoursPerWeek: "", 
    weeksPerYear: "52" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is hourly to annual salary calculator and why is it important?",
      answer: "The Hourly to Annual Salary Calculator is a tool designed to convert your hourly wage into an annual salary equivalent. It's important because it helps you understand your total earnings potential over a year, which is crucial for budgeting, loan applications, and financial planning. By knowing your annual salary, you can better compare job offers and negotiate wages."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is highly accurate, provided you input correct data. Factors like variable work hours or unpaid leave can affect accuracy. It's designed to give a reliable estimate, but for precise financial planning, consider consulting a financial advisor, especially if your work schedule is irregular. Regularly update your inputs to maintain accuracy, especially when your work conditions change."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "You need your hourly wage, the average number of hours you work per week, and the number of weeks you work per year. This information is typically found on your pay stub or employment contract. Ensure your inputs reflect your usual work schedule for the most accurate results. If your hours or weeks vary, use an average to get a reliable estimate."
    },
    {
      question: "Can I use this calculator for part-time jobs?",
      answer: "Yes, this calculator is suitable for part-time jobs. Simply enter your part-time hourly rate, average weekly hours, and weeks worked per year. The calculator will provide an accurate annual salary estimate. However, consider any additional income sources or irregular hours that might affect your total earnings. For part-time workers, it's crucial to account for any fluctuations in hours or additional jobs when planning your finances."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include incorrect hourly rate input, not accounting for unpaid leave, and misestimating weekly hours. These errors can lead to inaccurate annual salary estimates. Always double-check your inputs and consider any variables that might affect your work schedule. To avoid these mistakes, regularly update your inputs and consider consulting a financial advisor for complex scenarios."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculate whenever there's a change in your hourly rate, work hours, or weeks worked per year. Regular recalculations ensure your financial planning remains accurate. It's advisable to update your calculations at least annually or whenever you experience significant changes in your employment status. Keeping your calculations current helps you make informed decisions about spending, saving, and investing."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to plan your budget, set savings goals, and evaluate job offers. Understanding your annual salary helps you allocate funds for expenses, investments, and savings. If your results are lower than expected, consider strategies to increase your income, such as seeking a raise or additional work."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives include using monthly or bi-weekly salary calculations, which might be more relevant for salaried employees. These methods consider different pay periods and can provide insights into cash flow management. However, for hourly workers, the hourly to annual conversion remains the most straightforward and accurate method. Choose the method that best suits your employment type and financial goals. For more complex scenarios, consulting with a financial advisor is recommended."
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
    let hourlyRateValue = parseFloat(inputs.hourlyRate) || 0;
    const hoursPerWeekValue = parseFloat(inputs.hoursPerWeek) || 0;
    const weeksPerYearValue = parseFloat(inputs.weeksPerYear) || 0;

    // Validate
    if (hourlyRateValue <= 0 || hoursPerWeekValue <= 0 || weeksPerYearValue <= 0) {
      return { 
        annualSalary: 0, 
        monthlySalary: 0, 
        weeklySalary: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const weeklySalary = hourlyRateValue * hoursPerWeekValue;
    const annualSalary = weeklySalary * weeksPerYearValue;
    const monthlySalary = annualSalary / 12;

    // Generate schedule data if applicable (e.g., monthly breakdown)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthlySalary: monthlySalary,
      cumulativeSalary: monthlySalary * (i + 1),
    }));

    return { 
      annualSalary, 
      monthlySalary, 
      weeklySalary, 
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
    setInputs({ hourlyRate: "", hoursPerWeek: "", weeksPerYear: "52" });
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
              Hourly Rate
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.hourlyRate}
              onChange={(e) => setInputs({ ...inputs, hourlyRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Hours per Week
            </Label>
            <Input
              type="number"
              placeholder="e.g., 40"
              value={inputs.hoursPerWeek}
              onChange={(e) => setInputs({ ...inputs, hoursPerWeek: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Weeks per Year
            </Label>
            <Input
              type="number"
              placeholder="e.g., 52"
              value={inputs.weeksPerYear}
              onChange={(e) => setInputs({ ...inputs, weeksPerYear: e.target.value })}
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
      {results.annualSalary > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Annual Salary
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.annualSalary)}
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
                      Monthly Salary
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.monthlySalary)}
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
                      Weekly Salary
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.weeklySalary)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SCHEDULE TABLE */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Monthly Salary Schedule
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
                        <TableHead className="font-semibold">Monthly Salary</TableHead>
                        <TableHead className="font-semibold">Cumulative Salary</TableHead>
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
                            <TableCell>{formatCurrency(row.monthlySalary)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.cumulativeSalary)}
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
          Understanding Hourly to Annual Salary Converter
        </h2>
        
        <p className="mb-6">
          Converting your hourly wage to an annual salary is a crucial step in understanding your overall financial health. This conversion allows you to see the bigger picture of your earnings, helping you plan for future expenses, savings, and investments. Whether you're negotiating a new job offer or planning your household budget, knowing your annual salary gives you a clear perspective on your financial standing. This calculator simplifies the process, providing you with an accurate annual salary based on your hourly wage, hours worked per week, and weeks worked per year.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in financial planning. Misestimating your annual salary can lead to budgeting errors, affecting your ability to save, invest, or even cover daily expenses. For instance, if you underestimate your earnings, you might cut back unnecessarily on spending or saving. Conversely, overestimating could result in overspending and financial strain. This tool helps mitigate such risks by providing precise calculations, ensuring you make informed decisions. For more on financial planning, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather the following information: your hourly wage, the average number of hours you work per week, and the number of weeks you work per year. Enter these values into the respective fields. The calculator will then compute your weekly, monthly, and annual earnings. For the most accurate results, ensure your inputs reflect your typical work schedule. If you have variable hours or weeks, consider using an average. For more detailed financial insights, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. Small errors in your hourly rate or weekly hours can significantly impact your annual salary calculation. Use this tool regularly to adjust for any changes in your work schedule or pay rate.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal use, consider the following best practices: update your inputs whenever your work schedule or hourly rate changes, and use this tool to compare potential job offers. Understanding how different hourly rates translate into annual salaries can aid in making informed career decisions. Additionally, consider other factors such as benefits and bonuses that might affect your overall compensation.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Hourly to Annual Salary Converter Formula
        </h2>
        
        <p className="mb-6">
          The formula used to convert an hourly wage to an annual salary is straightforward yet powerful. It multiplies your hourly rate by the number of hours you work per week and then by the number of weeks you work per year. This formula is the industry standard for calculating annual salaries from hourly wages, providing a reliable estimate of your yearly earnings. Variations of this formula might include adjustments for unpaid leave or overtime, depending on your employment terms.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Annual Salary = Hourly Rate × Hours per Week × Weeks per Year
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Hourly Rate = Your wage per hour</li>
              <li>Hours per Week = Average hours worked each week</li>
              <li>Weeks per Year = Total weeks worked in a year</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role. The Hourly Rate is the foundation, representing your earnings per hour. The Hours per Week factor in your typical work schedule, while the Weeks per Year account for the total time you work annually. Adjusting any of these variables will directly impact your annual salary. For example, increasing your weekly hours or hourly rate will proportionally increase your annual earnings. Conversely, fewer working weeks will decrease your total salary.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your salary conversion is essential for accurate financial planning. These factors interact in complex ways, affecting your overall earnings and financial outlook. By recognizing these elements, you can better manage your income and make informed decisions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Hourly Rate
        </h3>
        <p className="mb-4">
          The hourly rate is the most direct factor affecting your annual salary. It represents the amount you earn for each hour worked. A higher hourly rate naturally leads to a higher annual salary, assuming other factors remain constant. For instance, a $5 increase in your hourly rate can significantly boost your yearly earnings.
        </p>
        <p className="mb-6">
          To optimize this factor, consider negotiating your hourly rate during job offers or performance reviews. Research industry standards to ensure your rate is competitive. For more insights on salary negotiation, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Hours Worked Per Week
        </h3>
        <p className="mb-4">
          The number of hours you work each week also impacts your annual salary. More hours mean more earnings, provided your hourly rate stays the same. For example, increasing your workweek from 35 to 40 hours can lead to a substantial increase in your annual salary.
        </p>
        <p className="mb-6">
          However, working more hours can also lead to burnout. Balance is key. Consider the long-term implications of your work schedule on your health and productivity. If possible, explore flexible working arrangements that maximize both your earnings and well-being.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Weeks Worked Per Year
        </h3>
        <p className="mb-4">
          The total number of weeks you work in a year is another critical factor. Most full-time positions assume 52 working weeks, but this can vary. Vacations, holidays, and unpaid leave can reduce the number of weeks you work, affecting your annual salary.
        </p>
        <p className="mb-6">
          To manage this factor, plan your time off strategically. Ensure that your annual salary accounts for any unpaid leave. If you're self-employed, consider how taking time off will impact your income and plan accordingly.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Overtime and Bonuses
        </h3>
        <p className="mb-6">
          Overtime and bonuses can significantly affect your annual salary. Overtime pay often comes at a higher rate, increasing your overall earnings. Bonuses, whether performance-based or seasonal, add to your annual income. Understanding how these elements fit into your salary structure can help you plan better financially.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Benefits and Deductions
        </h3>
        <p className="mb-6">
          While not directly part of your salary, benefits and deductions play a role in your overall compensation. Health insurance, retirement contributions, and other benefits can add significant value to your package. Conversely, deductions for taxes and other obligations reduce your take-home pay. Understanding these elements helps you see the full picture of your earnings.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-8">
          {/* QUESTION 1 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What is hourly to annual salary converter and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              An hourly to annual salary converter calculates your yearly earnings based on your hourly wage, weekly hours, and annual work weeks. It's crucial for understanding your total income, aiding in budgeting, financial planning, and salary negotiations. Knowing your annual salary helps you make informed decisions about spending, saving, and investing.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For more detailed financial planning, consider using our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator is highly accurate, provided you input correct data. Factors like variable work hours or unpaid leave can affect accuracy. It's designed to give a reliable estimate, but for precise financial planning, consider consulting a financial advisor, especially if your work schedule is irregular. Regularly update your inputs to maintain accuracy, especially when your work conditions change.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Regularly update your inputs to maintain accuracy, especially when your work conditions change.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              You need your hourly wage, the average number of hours you work per week, and the number of weeks you work per year. This information is typically found on your pay stub or employment contract. Ensure your inputs reflect your usual work schedule for the most accurate results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If your hours or weeks vary, use an average to get a reliable estimate.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for part-time jobs?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator is suitable for part-time jobs. Simply enter your part-time hourly rate, average weekly hours, and weeks worked per year. The calculator will provide an accurate annual salary estimate. However, consider any additional income sources or irregular hours that might affect your total earnings.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For part-time workers, it's crucial to account for any fluctuations in hours or additional jobs when planning your finances.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include incorrect hourly rate input, not accounting for unpaid leave, and misestimating weekly hours. These errors can lead to inaccurate annual salary estimates. Always double-check your inputs and consider any variables that might affect your work schedule.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, regularly update your inputs and consider consulting a financial advisor for complex scenarios.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculate whenever there's a change in your hourly rate, work hours, or weeks worked per year. Regular recalculations ensure your financial planning remains accurate. It's advisable to update your calculations at least annually or whenever you experience significant changes in your employment status.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Keeping your calculations current helps you make informed decisions about spending, saving, and investing.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to plan your budget, set savings goals, and evaluate job offers. Understanding your annual salary helps you allocate funds for expenses, investments, and savings. If your results are lower than expected, consider strategies to increase your income, such as seeking a raise or additional work.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For further financial planning, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives include using monthly or bi-weekly salary calculations, which might be more relevant for salaried employees. These methods consider different pay periods and can provide insights into cash flow management. However, for hourly workers, the hourly to annual conversion remains the most straightforward and accurate method.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Choose the method that best suits your employment type and financial goals. For more complex scenarios, consulting with a financial advisor is recommended.
            </p>
          </div>
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
                href="https://www.bls.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Bureau of Labor Statistics - Wage Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access comprehensive wage data and employment statistics for various industries.
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
                Official tax guidelines and information on deductions and credits.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.dol.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                U.S. Department of Labor - Employment Laws
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Information on labor laws and regulations affecting wages and working conditions.
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
                Comprehensive guides and articles on personal finance and investment strategies.
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
                NerdWallet - Money Management
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tools and advice for managing your money, including budgeting and investing tips.
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
                Consumer Financial Protection Bureau - Financial Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access financial tools and resources to help you make informed financial decisions.
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
      title="Hourly to Annual Salary Converter"
      description="Convert hourly wages to annual salary instantly. Calculate weekly, bi-weekly, monthly, and yearly earnings from your hourly rate."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Hourly to Annual Salary Converter" },
        { id: "formula", label: "Hourly to Annual Salary Converter Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Annual Salary = Hourly Rate × Hours per Week × Weeks per Year",
        variables: [
          { symbol: "Hourly Rate", description: "Your wage per hour" },
          { symbol: "Hours per Week", description: "Average hours worked each week" },
          { symbol: "Weeks per Year", description: "Total weeks worked in a year" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you earn $20 per hour, work 40 hours per week, and work 52 weeks a year.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "20 × 40 = 800", 
            explanation: "Calculate weekly earnings by multiplying hourly rate by hours per week." 
          },
          { 
            label: "Step 2", 
            calculation: "800 × 52 = 41,600", 
            explanation: "Determine annual salary by multiplying weekly earnings by weeks per year." 
          }
        ],
        result: "The final result is $41,600, meaning your annual salary is $41,600 based on the given inputs."
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
