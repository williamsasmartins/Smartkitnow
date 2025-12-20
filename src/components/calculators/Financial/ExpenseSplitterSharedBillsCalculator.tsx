import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function ExpenseSplitterSharedBillsCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    totalAmount: "", 
    numberOfPeople: "", 
    additionalCosts: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is expense splitter (shared bills) calculator and why is it important?",
      answer: "The Expense Splitter Calculator is a tool designed to help individuals fairly divide shared expenses among roommates or friends. It ensures that each person pays their fair share of bills, such as rent, utilities, and groceries, based on the total cost and number of people sharing the expenses. This calculator is important because it promotes transparency and helps prevent disputes over financial contributions. By using this calculator, you can easily manage shared finances and ensure that everyone is contributing equally. This is especially useful in shared living situations where expenses can vary. For more financial tools, explore our <a href=\"/financial/interest-only-loan\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Interest-Only Loan Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "The accuracy of the Expense Splitter Calculator depends on the accuracy of the inputs provided. As long as you enter the correct total amount, number of people, and additional costs, the calculator will provide precise results. However, it's important to note that any changes in these variables should be updated in the calculator to maintain accuracy. For complex financial situations, consider consulting a financial advisor to ensure that all factors are accounted for. Regularly updating the calculator with current data will help maintain its accuracy."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use the Expense Splitter Calculator, you will need the total amount of the shared bills, the number of people sharing the expenses, and any additional costs that should be divided. The total amount includes the main bill, such as rent or utilities. Additional costs might include service fees, tips, or any other expenses that need to be shared. Ensure that all information is accurate and up-to-date to get the most precise results. You can find this information on your bills or by discussing with your roommates. Keeping a record of shared expenses can also help in managing this data effectively."
    },
    {
      question: "Can I use this calculator for [specific scenario]?",
      answer: "Yes, the Expense Splitter Calculator can be used for a variety of scenarios where shared expenses need to be divided. Whether you're splitting rent, utilities, or a group dinner bill, this calculator can help ensure everyone pays their fair share. However, it's important to consider any unique circumstances that might affect the calculation, such as different usage levels or special agreements among roommates. If your scenario involves complex financial arrangements, consider adjusting the inputs to reflect these nuances. For example, if one person uses more utilities, you might adjust their share accordingly. This flexibility makes the calculator versatile for many shared expense situations."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include entering incorrect amounts, miscounting the number of people sharing the expenses, and forgetting to include additional costs. These errors can lead to inaccurate results and potential disputes among roommates. It's crucial to double-check all inputs and ensure they reflect the current situation. To avoid these mistakes, keep a detailed record of shared expenses and regularly update the calculator with any changes. Clear communication with your roommates can also help ensure that everyone is on the same page regarding shared costs."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculation is necessary whenever there are changes in the total amount, number of people, or additional costs. This might occur monthly when bills are due or whenever someone moves in or out. Regular recalculation ensures that everyone pays their fair share based on the most current data. Consider setting a regular schedule for recalculating, such as at the beginning of each month. This practice can help maintain transparency and prevent any financial misunderstandings among roommates."
    },
    {
      question: "What should I do with these results?",
      answer: "Once you have the results, communicate them clearly with everyone involved. Ensure that each person understands their share and is prepared to pay their portion. This can help prevent disputes and ensure that all bills are paid on time. If there are any discrepancies, discuss them openly to find a fair solution. If you're managing multiple shared expenses, consider using a financial app or spreadsheet to track payments and ensure accountability. For additional financial planning tools, visit our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "While the Expense Splitter Calculator provides a straightforward method for dividing shared expenses, there are alternative approaches. For example, some groups prefer to rotate bill payments, where each person takes turns paying the entire bill. Others might agree to split costs based on income levels or usage. Each method has its pros and cons, and the best approach depends on your specific situation and preferences. It's important to discuss these options with your roommates and choose a method that everyone agrees on. Flexibility and open communication are key to successfully managing shared expenses."
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
    const totalAmountValue = parseFloat(inputs.totalAmount) || 0;
    const numberOfPeopleValue = parseInt(inputs.numberOfPeople) || 0;
    const additionalCostsValue = parseFloat(inputs.additionalCosts) || 0;

    // Validate
    if (totalAmountValue <= 0 || numberOfPeopleValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalCost = totalAmountValue + additionalCostsValue;
    const perPersonCost = totalCost / numberOfPeopleValue;
    const mainResult = perPersonCost;
    const result2 = totalCost * 0.1; // Example: 10% service fee
    const result3 = totalCost * 0.15; // Example: 15% tip

    // Generate schedule data if applicable (e.g., payment schedule)
    const scheduleData = Array.from({ length: numberOfPeopleValue }, (_, i) => ({
      person: i + 1,
      payment: perPersonCost,
      additional: additionalCostsValue / numberOfPeopleValue,
      total: perPersonCost + (additionalCostsValue / numberOfPeopleValue),
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
    setInputs({ totalAmount: "", numberOfPeople: "", additionalCosts: "" });
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
              Total Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.totalAmount}
              onChange={(e) => setInputs({ ...inputs, totalAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Number of People
            </Label>
            <Input
              type="number"
              placeholder="e.g., 4"
              value={inputs.numberOfPeople}
              onChange={(e) => setInputs({ ...inputs, numberOfPeople: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Additional Costs
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={inputs.additionalCosts}
              onChange={(e) => setInputs({ ...inputs, additionalCosts: e.target.value })}
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
                      Cost Per Person
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
                      Service Fee (10%)
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
                      Tip (15%)
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
                        <TableHead className="font-semibold">Person</TableHead>
                        <TableHead className="font-semibold">Payment</TableHead>
                        <TableHead className="font-semibold">Additional</TableHead>
                        <TableHead className="font-semibold">Total</TableHead>
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
                            <TableCell className="font-medium">{row.person}</TableCell>
                            <TableCell>{formatCurrency(row.payment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.additional)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.total)}
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
          Understanding Expense Splitter (Shared Bills) Calculator
        </h2>
        
        <p className="mb-6">
          The Expense Splitter (Shared Bills) Calculator is an essential tool for anyone living with roommates or sharing expenses with friends. It simplifies the process of dividing bills such as rent, utilities, and groceries, ensuring that each person pays their fair share. This calculator is particularly useful in situations where expenses are not equally shared or when additional costs need to be accounted for. By using this tool, you can avoid misunderstandings and ensure transparency in financial arrangements.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in shared living situations to prevent disputes and maintain harmony. Incorrect calculations can lead to one person paying more than their fair share, causing tension and financial strain. The Expense Splitter Calculator helps you avoid these issues by providing precise calculations based on the inputs you provide. This tool is designed to help you make informed decisions about your shared expenses, allowing you to plan your budget effectively. For more insights into financial planning, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the Expense Splitter Calculator effectively, gather all necessary information before you begin. You will need the total amount of the shared bills, the number of people sharing the expenses, and any additional costs that need to be divided. Enter these values into the calculator, and it will compute the amount each person owes. For the most accurate results, ensure that all inputs are correct and up-to-date. You can also explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> for related calculations.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the number of people sharing the expenses and any additional costs. Miscounting or forgetting to include certain costs can lead to inaccurate results. This tool is designed to provide clarity, so ensure all data is accurate for the best outcome.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating the inputs as expenses and the number of people sharing costs change. Consider factors such as seasonal variations in utility bills or unexpected repairs that might affect the total amount. By staying proactive and adjusting the inputs as needed, you can maintain fairness and transparency in your financial arrangements.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Expense Splitter (Shared Bills) Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Expense Splitter Calculator is straightforward yet effective. It calculates the total cost by adding any additional expenses to the main bill amount and then divides this total by the number of people sharing the expenses. This method ensures that each person pays an equal share of the total cost, including any extra charges that might apply.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Cost Per Person = (Total Amount + Additional Costs) / Number of People
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Total Amount = The main bill amount</li>
              <li>Additional Costs = Any extra expenses to be shared</li>
              <li>Number of People = Total number of people sharing the costs</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the final result. The Total Amount represents the primary bill that needs to be divided, such as rent or a utility bill. Additional Costs include any extra charges that should be shared, like service fees or tips. The Number of People is the total count of individuals sharing the expenses. Changes in any of these variables will directly affect the cost per person, highlighting the importance of accurate data entry.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your expense splitting results is essential for ensuring fairness and accuracy. These factors can vary widely based on individual circumstances and should be considered carefully when using the calculator.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Number of People Sharing
        </h3>
        <p className="mb-4">
          The number of people sharing the expenses is a critical factor. A larger group means each person pays less, while a smaller group increases the cost per person. It's important to accurately count everyone involved to ensure fair distribution.
        </p>
        <p className="mb-6">
          If someone moves in or out, update the calculator to reflect these changes. This ensures that everyone pays their fair share based on the current living arrangement. For more on managing shared finances, see our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Additional Costs
        </h3>
        <p className="mb-4">
          Additional costs like service fees, tips, or unexpected expenses can significantly impact the total amount each person owes. These should be included in the calculation to ensure everyone contributes fairly.
        </p>
        <p className="mb-6">
          Consider setting aside a small contingency fund to cover unexpected costs. This can prevent disputes and ensure that everyone is prepared for any additional expenses that arise.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Fluctuating Utility Bills
        </h3>
        <p className="mb-4">
          Utility bills can fluctuate based on usage and season. It's important to account for these changes when calculating shared expenses. Higher usage during certain months may increase the total amount owed.
        </p>
        <p className="mb-6">
          To manage this, consider averaging the utility costs over several months to smooth out any spikes. This approach can help maintain consistent payments and avoid surprises.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Rent Increases
        </h3>
        <p className="mb-6">
          Rent increases can affect the total amount that needs to be divided among roommates. It's important to update the calculator with any changes in rent to ensure accurate calculations. Discuss potential rent increases with your landlord and plan accordingly to avoid financial strain.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Special Arrangements
        </h3>
        <p className="mb-6">
          In some cases, special arrangements might affect how expenses are split. For example, if one roommate uses more utilities or has a larger room, they might agree to pay a higher share. These arrangements should be clearly communicated and reflected in the calculator to ensure transparency and fairness.
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
                Federal Reserve - Shared Financial Responsibilities
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on managing shared financial responsibilities and guidelines for fair practices.
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
                Consumer Financial Protection Bureau - Budgeting Tips
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on budgeting and expense sharing.
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
                FDIC - Financial Literacy Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information with a focus on financial literacy.
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
                Internal Revenue Service - Tax Implications of Shared Living
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information relevant to shared living arrangements.
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
                Investopedia - Managing Shared Expenses
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained, including managing shared expenses.
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
                NerdWallet - Shared Financial Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers focusing on shared financial planning.
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
      title="Expense Splitter (Shared Bills) Calculator"
      description="Split shared bills fairly among roommates or friends. Calculate exactly who owes what for rent, utilities, and groceries."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Expense Splitter (Shared Bills) Calculator" },
        { id: "formula", label: "Expense Splitter (Shared Bills) Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Cost Per Person = (Total Amount + Additional Costs) / Number of People",
        variables: [
          { symbol: "Total Amount", description: "The main bill amount" },
          { symbol: "Additional Costs", description: "Any extra expenses to be shared" },
          { symbol: "Number of People", description: "Total number of people sharing the costs" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a total bill of $500 with additional costs of $50, shared among 5 people.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "500 + 50 = 550", 
            explanation: "Calculate the total cost including additional expenses." 
          },
          { 
            label: "Step 2", 
            calculation: "550 / 5 = 110", 
            explanation: "Divide the total cost by the number of people to find the cost per person." 
          }
        ],
        result: "The final result is $110 per person, meaning each person should pay $110 to cover the shared expenses."
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
