import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DebtSnowballCalculator() {
  // STATE
  const [debts, setDebts] = useState([{ balance: "", rate: "", payment: "" }]);
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
    let totalDebt = 0;
    let totalInterest = 0;
    const scheduleData = debts.map((debt, index) => {
      const balance = parseFloat(debt.balance) || 0;
      const rate = parseFloat(debt.rate) || 0;
      const payment = parseFloat(debt.payment) || 0;

      if (balance <= 0 || rate <= 0 || payment <= 0) {
        return null;
      }

      const monthlyRate = rate / 100 / 12;
      let remainingBalance = balance;
      let totalPayment = 0;
      let totalInterestPaid = 0;
      let month = 0;

      while (remainingBalance > 0) {
        const interest = remainingBalance * monthlyRate;
        const principal = Math.min(payment - interest, remainingBalance);
        remainingBalance -= principal;
        totalPayment += payment;
        totalInterestPaid += interest;
        month++;
      }

      totalDebt += balance;
      totalInterest += totalInterestPaid;

      return {
        index,
        totalPayment,
        totalInterestPaid,
        months: month,
      };
    }).filter(Boolean);

    return {
      totalDebt,
      totalInterest,
      scheduleData,
    };
  }, [debts]);

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
    setDebts([{ balance: "", rate: "", payment: "" }]);
  };

  const addDebtField = () => {
    setDebts([...debts, { balance: "", rate: "", payment: "" }]);
  };

  const updateDebtField = (index: number, field: string, value: string) => {
    const updatedDebts = debts.map((debt, i) => i === index ? { ...debt, [field]: value } : debt);
    setDebts(updatedDebts);
  };

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        {debts.map((debt, index) => (
          <div key={index} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4 text-blue-600"/>
                Debt Balance
              </Label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={debt.balance}
                onChange={(e) => updateDebtField(index, "balance", e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <TrendingUp className="w-4 h-4 text-green-600"/>
                Interest Rate (%)
              </Label>
              <Input
                type="number"
                placeholder="e.g., 5"
                value={debt.rate}
                onChange={(e) => updateDebtField(index, "rate", e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calculator className="w-4 h-4 text-purple-600"/>
                Monthly Payment
              </Label>
              <Input
                type="number"
                placeholder="e.g., 50"
                value={debt.payment}
                onChange={(e) => updateDebtField(index, "payment", e.target.value)}
                className="text-lg"
              />
            </div>
          </div>
        ))}
        <Button onClick={addDebtField} className="mt-4">
          Add Another Debt
        </Button>
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
      {results.totalDebt > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Debt
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.totalDebt)}
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
                      Total Interest Paid
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
                      Total Payments
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalDebt + results.totalInterest)}
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
                        <TableHead className="font-semibold">Debt #</TableHead>
                        <TableHead className="font-semibold">Total Payment</TableHead>
                        <TableHead className="font-semibold">Interest Paid</TableHead>
                        <TableHead className="font-semibold">Months</TableHead>
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
                            <TableCell className="font-medium">{row.index + 1}</TableCell>
                            <TableCell>{formatCurrency(row.totalPayment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.totalInterestPaid)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {row.months}
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
          Understanding Debt Snowball Calculator
        </h2>
        
        <p className="mb-6">
          The Debt Snowball Calculator is a powerful tool designed to help individuals manage and eliminate their debts more efficiently. By organizing debts from the smallest to the largest balance, this method allows users to build momentum as they pay off each debt. This approach not only simplifies the debt repayment process but also provides psychological benefits by offering quick wins, which can be motivating. Whether you're dealing with credit card debt, student loans, or personal loans, the debt snowball method can be an effective strategy to regain control over your financial situation.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial when dealing with debt repayment strategies. Incorrect calculations can lead to financial setbacks, increased interest payments, and prolonged debt periods. The Debt Snowball Calculator ensures that you have a clear understanding of your repayment plan, helping you avoid these pitfalls. According to a study by the American Psychological Association, financial stress is a significant source of anxiety for many individuals. By using this calculator, you can alleviate some of that stress by having a concrete plan in place. For more insights on managing financial stress, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the Debt Snowball Calculator effectively, gather all your debt information, including balances, interest rates, and minimum payments. Enter these details into the calculator to generate a customized repayment plan. The calculator will prioritize your debts, allowing you to focus on paying off the smallest balance first while maintaining minimum payments on larger debts. This strategy helps you reduce the number of debts quickly, providing a sense of accomplishment and motivation to continue. For more detailed guidance, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            One critical tip when using the Debt Snowball Calculator is to remain consistent with your payments. Avoid the temptation to skip payments or reduce the amount you're paying towards your debts. Consistency is key to the success of the debt snowball method, as it relies on the momentum built from paying off smaller debts first.
          </p>
        </div>
        
        <p className="mb-6">
          To optimize your debt repayment strategy, consider increasing your monthly payments whenever possible. Even a small increase can significantly impact the time it takes to become debt-free. Additionally, avoid taking on new debt during this process, as it can derail your progress. Keep track of your progress regularly and adjust your plan as needed to stay on track. For more tips on optimizing your financial strategies, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Debt Snowball Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Debt Snowball Calculator uses a straightforward formula to determine the order and amount of payments required to eliminate your debts. This method focuses on paying off the smallest debt first while making minimum payments on larger debts. The formula is based on the principle of compounding motivation, where paying off smaller debts quickly provides a psychological boost, encouraging continued progress.
        </p>
        
        <p className="mb-6">
          The formula used in this calculator is: 
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Payment = Minimum Payment + Extra Payment
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Minimum Payment = The minimum amount required to keep the debt current</li>
              <li>Extra Payment = Additional amount paid to accelerate debt payoff</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the speed and efficiency of your debt repayment plan. The Minimum Payment is the amount you must pay to avoid penalties and keep your account in good standing. The Extra Payment is any additional amount you can contribute towards reducing the principal balance of your debt. By increasing the Extra Payment, you can significantly reduce the time it takes to pay off your debt and the total interest paid over the life of the loan. For more insights on managing debt effectively, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your debt repayment plan is essential for maximizing the effectiveness of the Debt Snowball Calculator. These factors can significantly impact the time it takes to become debt-free and the total interest paid. By being aware of these elements, you can make informed decisions and adjust your strategy as needed.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rates
        </h3>
        <p className="mb-4">
          Interest rates play a critical role in determining how much you will pay over the life of your debt. Higher interest rates mean more of your payment goes towards interest rather than reducing the principal balance. It's essential to understand the interest rates on each of your debts and prioritize paying off high-interest debts first if possible.
        </p>
        <p className="mb-6">
          To optimize your repayment strategy, consider refinancing high-interest debts to lower rates. This can reduce the total interest paid and accelerate your path to becoming debt-free. For more information on refinancing options, visit our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Monthly Income
        </h3>
        <p className="mb-4">
          Your monthly income determines how much you can allocate towards debt repayment. A higher income allows for larger payments, reducing the time it takes to pay off your debts. It's crucial to create a budget that prioritizes debt repayment while still covering essential expenses.
        </p>
        <p className="mb-6">
          Consider increasing your income through side jobs or freelance work to boost your repayment efforts. Additionally, cutting unnecessary expenses can free up more funds for debt payments. For budgeting tips, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Debt Balances
        </h3>
        <p className="mb-4">
          The size of your debt balances affects the time and effort required to pay them off. Larger balances take longer to eliminate, especially if interest rates are high. It's essential to have a clear understanding of all your debt balances to prioritize them effectively.
        </p>
        <p className="mb-6">
          Focus on paying off smaller balances first to gain momentum and motivation. This approach, known as the debt snowball method, can provide quick wins and encourage continued progress. For more strategies on managing debt balances, visit our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Payment Consistency
        </h3>
        <p className="mb-6">
          Consistency in making payments is crucial for the success of your debt repayment plan. Missing payments can result in penalties, increased interest rates, and a longer repayment period. It's essential to set up automatic payments or reminders to ensure you never miss a payment.
        </p>
        <p className="mb-6">
          If you're struggling to make consistent payments, consider adjusting your budget or seeking professional financial advice. For more tips on maintaining payment consistency, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Additional Payments
        </h3>
        <p className="mb-6">
          Making additional payments beyond the minimum required can significantly reduce the time it takes to pay off your debts. These extra payments go directly towards reducing the principal balance, which decreases the total interest paid over time.
        </p>
        <p className="mb-6">
          Whenever possible, allocate windfalls such as tax refunds or bonuses towards your debt repayment plan. This strategy can accelerate your progress and help you achieve financial freedom sooner. For more insights on making extra payments, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
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
                Federal Reserve - Debt Management
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on debt management strategies and regulatory guidelines.
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
                Consumer Financial Protection Bureau - Debt Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on debt.
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
                Banking regulations and financial education resources for managing debt.
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
                Internal Revenue Service - Tax Implications
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and information on how debt affects your taxes.
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
                Investopedia - Debt Management
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and strategies for managing and reducing debt.
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
                NerdWallet - Debt Reduction Tips
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for effective debt reduction.
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
      title="Debt Snowball Calculator"
      description="Use the debt snowball method to pay off debts faster. Organize debts from smallest to largest balance to build momentum."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Debt Snowball Calculator" },
        { id: "formula", label: "Debt Snowball Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Payment = Minimum Payment + Extra Payment",
        variables: [
          { symbol: "Minimum Payment", description: "The minimum amount required to keep the debt current" },
          { symbol: "Extra Payment", description: "Additional amount paid to accelerate debt payoff" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a credit card debt of $5,000 with an interest rate of 18% and a minimum payment of $150.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Calculate the interest: $5,000 × (18% / 12) = $75", 
            explanation: "Determine the monthly interest cost." 
          },
          { 
            label: "Step 2", 
            calculation: "Subtract interest from payment: $150 - $75 = $75", 
            explanation: "Calculate the principal reduction." 
          },
          { 
            label: "Step 3", 
            calculation: "New balance: $5,000 - $75 = $4,925", 
            explanation: "Update the balance after payment." 
          }
        ],
        result: "The final result shows that after one payment, your new balance is $4,925, reducing your debt by $75."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "📊" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}