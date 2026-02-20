import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Calendar, Percent, HelpCircle, BookOpen, Info, CheckCircle, TrendingUp, Share2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AutoLoanCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();

  // STATE
  const [inputs, setInputs] = useState({
    loanAmount: searchParams.get("amount") || "",
    interestRate: searchParams.get("rate") || "",
    loanTerm: searchParams.get("term") || ""
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-calculate on mount if params exist
  useEffect(() => {
    if (searchParams.size > 0 && inputs.loanAmount && inputs.interestRate && inputs.loanTerm) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
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
    let loanAmountValue = parseFloat(inputs.loanAmount) || 0;
    const interestRateValue = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const loanTermValue = parseFloat(inputs.loanTerm) * 12 || 0;

    // Validate
    if (loanAmountValue <= 0 || interestRateValue <= 0 || loanTermValue <= 0) {
      return {
        mainResult: 0,
        totalInterest: 0,
        totalPayment: 0,
        scheduleData: []
      };
    }

    // Perform calculations here
    const monthlyPayment = loanAmountValue * interestRateValue / (1 - Math.pow(1 + interestRateValue, -loanTermValue));
    const totalPayment = monthlyPayment * loanTermValue;
    const totalInterest = totalPayment - loanAmountValue;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: loanTermValue }, (_, i) => {
      const interestPayment = loanAmountValue * interestRateValue;
      const principalPayment = monthlyPayment - interestPayment;
      loanAmountValue -= principalPayment;
      return {
        month: i + 1,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: loanAmountValue
      };
    });

    return {
      mainResult: monthlyPayment,
      totalInterest,
      totalPayment,
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
    setInputs({ loanAmount: "", interestRate: "", loanTerm: "" });
    setSearchParams({});
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (inputs.loanAmount) params.set("amount", inputs.loanAmount);
    if (inputs.interestRate) params.set("rate", inputs.interestRate);
    if (inputs.loanTerm) params.set("term", inputs.loanTerm);

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
    navigator.clipboard.writeText(newUrl);
    toast.success("Link copied to clipboard!");
  };

  const faqs = [
    {
      question: "What is an auto loan calculator?",
      answer: "An auto loan calculator is a tool that helps you estimate your monthly car payments based on the loan amount, interest rate, and loan term. It allows you to see how different factors, such as a larger down payment or a lower interest rate, can affect your monthly budget. For more detailed loan analysis, check out our <a href=\"/financial/loan-payment\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Loan Payment Calculator</a>."
    },
    {
      question: "How does the loan term affect my monthly payment?",
      answer: "The loan term is the length of time you have to repay the loan. A longer loan term typically results in lower monthly payments but higher total interest costs over the life of the loan. Conversely, a shorter loan term increases your monthly payments but saves you money on interest. Choose a term that balances affordability with total cost."
    },
    {
      question: "What is a good interest rate for an auto loan?",
      answer: "Interest rates vary based on your credit score, the lender, and current market conditions. generally, a 'good' rate is one that is lower than the national average for your credit tier. Borrowers with excellent credit usually qualify for the lowest rates. It's always a good idea to shop around and compare offers from multiple lenders."
    },
    {
      question: "Should I make a down payment?",
      answer: "Yes, making a down payment is highly recommended. A down payment reduces the amount you need to borrow, which in turn lowers your monthly payments and total interest costs. It also helps you build equity in the vehicle faster and may help you qualify for a better interest rate."
    },
    {
      question: "What other costs should I consider?",
      answer: "In addition to the monthly loan payment, you should consider other costs of car ownership, such as auto insurance, fuel, maintenance, repairs, and registration fees. These ongoing expenses can add up significantly, so it's important to budget for them. Use our <a href=\"/financial/budget-planner\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Budget Planner</a> to manage your overall finances."
    },
    {
      question: "How does my credit score affect my loan?",
      answer: "Your credit score is a key factor in determining your loan eligibility and interest rate. A higher credit score generally leads to better loan terms and lower interest rates. If your score is low, you may face higher rates or difficulty getting approved. improving your credit score before applying can save you money."
    },
    {
      question: "Can I pay off my auto loan early?",
      answer: "Most auto loans allow you to pay off the debt early without penalty, but it's important to check your loan agreement for any prepayment penalties. Paying off your loan early can save you a significant amount in interest. If you have extra funds, consider making additional principal payments."
    },
    {
      question: "Is it better to lease or buy?",
      answer: "The decision to lease or buy depends on your personal preferences and financial situation. Buying allows you to own the vehicle and build equity, while leasing typically offers lower monthly payments but no ownership at the end of the term. Consider how many miles you drive and how long you plan to keep the car before deciding."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Loan Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30000"
              value={inputs.loanAmount}
              onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3.5"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600" />
              Loan Term (years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.loanTerm}
              onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
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
          <Calculator className="mr-2 h-4 w-4" />
          Calculate
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-gray-300 dark:border-gray-600"
        >
          Reset
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 px-3"
          title="Share result"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* RESULTS SECTION */}
      {results.mainResult > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>

          {/* VISUAL CHART */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Principal', value: parseFloat(inputs.loanAmount) || 0, fill: '#3b82f6' },
                      { name: 'Interest', value: results.totalInterest, fill: '#f43f5e' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Principal', fill: '#3b82f6' },
                      { name: 'Interest', fill: '#f43f5e' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    itemStyle={{ color: "#1e293b" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Monthly Payment
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
                      Total Interest
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
                      Total Payment
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalPayment)}
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
                        <TableHead className="font-semibold">Month</TableHead>
                        <TableHead className="font-semibold">Payment</TableHead>
                        <TableHead className="font-semibold">Principal</TableHead>
                        <TableHead className="font-semibold">Interest</TableHead>
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
                            <TableCell>{formatCurrency(row.payment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.principal)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.interest)}
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
          Understanding Auto Loan Calculator
        </h2>

        <p className="mb-6">
          The Auto Loan Calculator is an essential tool for anyone considering purchasing a vehicle through financing. It helps you understand the monthly payments you will need to make, the total interest you will pay over the life of the loan, and the overall cost of the loan. By inputting the loan amount, interest rate, and loan term, you can quickly get a clear picture of your financial commitment. This calculator is particularly useful for comparing different loan offers and understanding how different interest rates and loan terms affect your payments.
        </p>

        <p className="mb-6">
          Accurate calculations are crucial when it comes to auto loans, as even small errors can lead to significant financial implications. For instance, underestimating your monthly payments could result in financial strain, while overestimating could mean missing out on a better deal. According to recent statistics, the average auto loan amount has been steadily increasing, making it even more important to use tools like this calculator to make informed decisions. By using this calculator, you can ensure that you are fully aware of the financial commitment you are making and avoid any unpleasant surprises down the line. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>

        <p className="mb-6">
          To use this calculator effectively, you will need to gather some key information. Start by determining the total amount you plan to borrow, which is the loan amount. Next, find out the interest rate offered by your lender, which is usually expressed as an annual percentage rate (APR). Finally, decide on the loan term, which is the number of years you plan to take to repay the loan. Once you have this information, enter it into the calculator to see your estimated monthly payment, total interest, and total payment. For additional guidance, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5" />
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            When using the Auto Loan Calculator, always double-check the interest rate and loan term. These two factors have the most significant impact on your monthly payment and total interest. Consider running multiple scenarios with different rates and terms to find the best option for your budget.
          </p>
        </div>

        <p className="mb-6">
          Best practices for using this calculator include being realistic about your budget and considering additional costs such as insurance and maintenance. It's also wise to factor in any potential changes in your financial situation, such as a job change or unexpected expenses. By taking these factors into account, you can optimize your loan terms and ensure that your auto purchase is a financially sound decision.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Auto Loan Calculator Formula
        </h2>

        <p className="mb-6">
          The Auto Loan Calculator uses a standard formula to determine your monthly payment. This formula is widely accepted in the financial industry and is based on the principle of amortization, where each payment covers both the interest and a portion of the principal. The formula takes into account the loan amount, the interest rate, and the loan term to calculate the fixed monthly payment you will need to make over the life of the loan.
        </p>

        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          M = P[r(1+r)^n] / [(1+r)^n – 1]
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>M = Monthly payment</li>
              <li>P = Loan amount (principal)</li>
              <li>r = Monthly interest rate (annual rate / 12)</li>
              <li>n = Number of payments (loan term in months)</li>
            </ul>
          </div>
        </div>

        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the monthly payment. The loan amount (P) is the total amount you borrow, while the interest rate (r) is the cost of borrowing that amount, expressed as a monthly rate. The loan term (n) is the total number of payments you will make, which is typically the number of years multiplied by 12. By adjusting these variables, you can see how different loan scenarios affect your monthly payment and total interest paid.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>

        <p className="mb-6">
          Understanding the factors that affect your auto loan results is crucial for making informed financial decisions. These factors can significantly impact your monthly payments and the total cost of your loan. By considering each factor carefully, you can optimize your loan terms and ensure that your auto purchase is a sound financial decision.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is one of the most significant factors affecting your auto loan. It determines the cost of borrowing and directly impacts your monthly payment and total interest paid. A lower interest rate means lower monthly payments and less interest over the life of the loan. It's important to shop around and compare rates from different lenders to find the best deal. For more tips, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        <p className="mb-6">
          When comparing interest rates, consider both the nominal rate and the annual percentage rate (APR), which includes any additional fees or costs associated with the loan. A lower APR indicates a better overall deal. Additionally, consider the impact of your credit score on the interest rate offered by lenders.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term is the length of time you have to repay the loan, typically expressed in years. A longer loan term results in lower monthly payments but higher total interest paid over the life of the loan. Conversely, a shorter loan term means higher monthly payments but less interest paid overall. It's important to balance the loan term with your budget and financial goals.
        </p>
        <p className="mb-6">
          Consider how long you plan to keep the vehicle and whether you anticipate any changes in your financial situation. A shorter loan term may be more challenging to manage monthly, but it can save you money in the long run. For more insights, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Amount
        </h3>
        <p className="mb-4">
          The loan amount is the total amount you borrow to purchase the vehicle. It includes the price of the car, minus any down payment or trade-in value. A larger loan amount results in higher monthly payments and more interest paid over the life of the loan. It's important to borrow only what you need and can afford to repay comfortably.
        </p>
        <p className="mb-6">
          Consider the total cost of ownership, including taxes, fees, and insurance, when determining the loan amount. A larger down payment can reduce the loan amount and result in lower monthly payments and less interest paid. For more guidance, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Credit Score
        </h3>
        <p className="mb-6">
          Your credit score is a key factor that lenders consider when determining the interest rate and loan terms. A higher credit score indicates a lower risk to lenders and can result in a lower interest rate and better loan terms. It's important to check your credit score before applying for a loan and take steps to improve it if necessary. Paying bills on time, reducing debt, and avoiding new credit inquiries can help boost your score.
        </p>
        <p className="mb-6">
          Consider obtaining a copy of your credit report to identify any errors or areas for improvement. A higher credit score can save you thousands of dollars in interest over the life of the loan. For more information, visit our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Additional Costs
        </h3>
        <p className="mb-6">
          Additional costs such as taxes, fees, and insurance can significantly impact the total cost of your auto loan. It's important to factor these costs into your budget and loan calculations. Consider the impact of sales tax, registration fees, and insurance premiums on your overall financial commitment. By accounting for these costs upfront, you can avoid surprises and ensure that your auto purchase is financially sustainable.
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
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0" />
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
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.federalreserve.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Reserve - Auto Loan Rates
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on current auto loan rates and economic trends
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.consumerfinance.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Consumer Financial Protection Bureau - Auto Loans
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on auto loans
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.fdic.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                FDIC - Auto Loan Insights
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and insights into auto loan products
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.irs.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Internal Revenue Service - Vehicle Deductions
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information for vehicle-related expenses
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.investopedia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Investopedia - Auto Loan Basics
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts related to auto loans
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.nerdwallet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                NerdWallet - Auto Loan Guide
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for auto loans
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
      title="Auto Loan Calculator"
      description="Calculate your auto loan payments accurately. Factor in trade-in value, sales tax, and fees to get a clear picture of your car purchase."
      canonical="/financial/auto-loan"
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Auto Loan Calculator" },
        { id: "formula", label: "Auto Loan Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "M = P[r(1+r)^n] / [(1+r)^n – 1]",
        variables: [
          { symbol: "M", description: "Monthly payment" },
          { symbol: "P", description: "Loan amount (principal)" },
          { symbol: "r", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Number of payments (loan term in months)" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a loan amount of $30,000 with an interest rate of 3.5% over a 5-year term.",
        steps: [
          {
            label: "Step 1",
            calculation: "Convert annual interest rate to monthly: 3.5% / 12 = 0.0029167",
            explanation: "Calculate the monthly interest rate."
          },
          {
            label: "Step 2",
            calculation: "Calculate monthly payment: M = 30000[0.0029167(1+0.0029167)^60] / [(1+0.0029167)^60 – 1]",
            explanation: "Use the formula to determine monthly payment."
          },
          {
            label: "Step 3",
            calculation: "The monthly payment is approximately $547.50",
            explanation: "This is the amount you will pay each month for 5 years."
          }
        ],
        result: "The final result is a monthly payment of approximately $547.50, meaning you will pay this amount each month for the duration of the loan."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💳" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}
