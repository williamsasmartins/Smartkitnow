import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const faqs = [
  {
    question: "What is lease vs buy calculator and why is it important?",
    answer: "The Lease vs Buy Calculator is a tool that helps users compare the financial implications of leasing versus buying a vehicle. It evaluates the total cost of both options, considering factors like purchase price, loan term, interest rate, lease term, monthly lease payments, and residual value. This calculator is important because it provides a clear comparison, enabling users to make informed decisions about which option is more cost-effective in the long run.\n\nBy understanding the total cost of ownership, users can avoid unexpected expenses and make better financial choices. For more information on related calculations, visit our <a href=\"/financial/extra-payments-payoff\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Extra Payments & Payoff Time Calculator</a>."
  },
  {
    question: "How accurate is this calculator?",
    answer: "The Lease vs Buy Calculator is designed to provide accurate estimates based on the inputs provided. However, the accuracy of the results depends on the accuracy of the input data. Factors such as fluctuating interest rates, changes in residual values, and additional fees can affect the final outcome. It's important to use the most current and accurate data available for the best results.\n\nFor complex financial decisions, consider consulting with a financial advisor to ensure all factors are considered. Regularly updating your inputs can also help maintain accuracy."
  },
  {
    question: "What information do I need to use this calculator?",
    answer: "To use the Lease vs Buy Calculator, you'll need the following information: the vehicle's purchase price, the loan term in years, the annual interest rate, the lease term in months, the monthly lease payment, and the residual value of the vehicle. This data allows the calculator to provide a comprehensive comparison of the total cost of leasing versus buying.\n\nYou can find this information in your loan or lease agreement, or by contacting your dealer or lender. Ensuring the accuracy of this data is crucial for obtaining reliable results."
  },
  {
    question: "Can I use this calculator for specific scenarios?",
    answer: "Yes, the Lease vs Buy Calculator can be used for various scenarios, such as comparing different vehicle models, evaluating the impact of different interest rates, or assessing the cost of leasing versus buying over different terms. However, it's important to note that the calculator provides estimates based on the inputs provided, and actual costs may vary due to factors like maintenance, insurance, and taxes.\n\nFor more complex scenarios, consider consulting with a financial advisor or using additional tools like our <a href=\"/financial/loan-payment\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Loan Payment Calculator</a> for more detailed analysis."
  },
  {
    question: "What are common mistakes people make with this calculation?",
    answer: "Common mistakes include using outdated or incorrect input data, not considering additional costs like maintenance and insurance, and failing to account for changes in interest rates or residual values. These errors can lead to inaccurate results and potentially costly financial decisions.\n\nTo avoid these mistakes, ensure all input data is current and accurate, and consider consulting with a financial advisor for complex decisions. Regularly updating your calculations can also help maintain accuracy."
  },
  {
    question: "How often should I recalculate?",
    answer: "It's recommended to recalculate whenever there are significant changes in your financial situation, such as changes in interest rates, vehicle prices, or lease terms. Additionally, if you're considering a new vehicle purchase or lease, updating your calculations can help ensure you're making the most informed decision.\n\nRegular recalculations can also help you stay on top of your financial goals and adjust your plans as needed. For more insights, explore our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a>."
  },
  {
    question: "What should I do with these results?",
    answer: "Once you've obtained the results from the Lease vs Buy Calculator, use them to compare the total cost of leasing versus buying. Consider how these costs align with your financial goals and budget. If leasing is more cost-effective, evaluate the terms and conditions of the lease agreement. If buying is preferable, consider the long-term benefits of ownership.\n\nFor further analysis, consult with a financial advisor or explore additional tools like our <a href=\"/financial/interest-only-loan\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Interest-Only Loan Calculator</a> to understand the broader financial implications."
  },
  {
    question: "Are there alternatives to this calculation method?",
    answer: "While the Lease vs Buy Calculator provides a comprehensive comparison, there are alternative methods for evaluating vehicle financing options. These include consulting with a financial advisor, using other online calculators, or conducting a detailed cost analysis based on your specific financial situation.\n\nEach method has its pros and cons, and the best approach depends on your individual needs and preferences. For a broader perspective, consider exploring our <a href=\"/financial/heloc-payment-estimator\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">HELOC Payment Estimator</a> for additional insights."
  }
];

export default function LeaseVsBuyCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    purchasePrice: "", 
    loanTerm: "", 
    interestRate: "", 
    leaseTerm: "", 
    leasePayment: "", 
    residualValue: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
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
    // Parse inputs
    let purchasePrice = parseFloat(inputs.purchasePrice) || 0;
    const loanTerm = parseFloat(inputs.loanTerm) || 0;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const leaseTerm = parseFloat(inputs.leaseTerm) || 0;
    const leasePayment = parseFloat(inputs.leasePayment) || 0;
    const residualValue = parseFloat(inputs.residualValue) || 0;

    // Validate
    if (purchasePrice <= 0 || loanTerm <= 0 || interestRate <= 0 || leaseTerm <= 0 || leasePayment <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const monthlyInterestRate = interestRate / 100 / 12;
    const loanPayment = (purchasePrice * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm * 12));
    const totalLoanCost = loanPayment * loanTerm * 12;
    const totalLeaseCost = leasePayment * leaseTerm + residualValue;

    // Generate schedule data
    const scheduleData = Array.from({ length: leaseTerm }, (_, i) => ({
      month: i + 1,
      payment: leasePayment,
      principal: leasePayment * 0.7,
      interest: leasePayment * 0.3,
      balance: totalLeaseCost - (leasePayment * (i + 1))
    }));

    return { 
      mainResult: totalLoanCost, 
      result2: totalLeaseCost, 
      result3: totalLoanCost - totalLeaseCost, 
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
    setInputs({ purchasePrice: "", loanTerm: "", interestRate: "", leaseTerm: "", leasePayment: "", residualValue: "" });
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
              Purchase Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30000"
              value={inputs.purchasePrice}
              onChange={(e) => setInputs({ ...inputs, purchasePrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
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

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
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

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Lease Term (months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 36"
              value={inputs.leaseTerm}
              onChange={(e) => setInputs({ ...inputs, leaseTerm: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Monthly Lease Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 400"
              value={inputs.leasePayment}
              onChange={(e) => setInputs({ ...inputs, leasePayment: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Residual Value
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15000"
              value={inputs.residualValue}
              onChange={(e) => setInputs({ ...inputs, residualValue: e.target.value })}
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
                      Total Loan Cost
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
                      Total Lease Cost
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
                      Cost Difference
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
                    Lease Payment Schedule
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
          Understanding Lease vs Buy Calculator
        </h2>
        
        <p className="mb-6">
          The Lease vs Buy Calculator is a powerful tool designed to help individuals make informed decisions about whether to lease or buy a vehicle. This calculator evaluates the total cost of both options, taking into account various factors such as purchase price, loan term, interest rate, lease term, monthly lease payments, and residual value. By comparing these costs, users can determine which option is more financially viable in the long run. Whether you're a first-time car buyer or considering upgrading your vehicle, understanding the financial implications of leasing versus buying is crucial for making the best decision for your budget and lifestyle.
        </p>
        
        <p className="mb-6">
          Accurate calculations are essential in the realm of vehicle financing, as they can significantly impact your financial health. Incorrect calculations may lead to unexpected expenses or missed opportunities for savings. According to industry data, leasing can sometimes appear cheaper upfront, but buying might offer better value over time. This calculator helps you navigate these complexities by providing a clear comparison of both options. For those interested in exploring more about financial calculations, our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> offers insights into principal, rate, and term calculations.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information such as the vehicle's purchase price, the length of the loan or lease term, the interest rate, and the monthly lease payment. Enter these values into the respective fields to see a detailed breakdown of costs. The calculator will provide you with the total cost of buying versus leasing, helping you make a well-informed decision. For more detailed financial planning, consider using our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            When using the Lease vs Buy Calculator, remember that the residual value of a leased vehicle can significantly affect the total cost. A higher residual value means lower depreciation, which can make leasing more attractive. Always verify the residual value with your dealer to ensure accurate calculations.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include considering the total cost of ownership, not just monthly payments. Factors like maintenance, insurance, and potential tax benefits should also be taken into account. Understanding these elements can help you optimize your decision-making process. For those looking to explore more financial tools, our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> can provide insights into how additional payments affect loan terms.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Lease vs Buy Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Lease vs Buy Calculator uses a comprehensive formula to evaluate the total cost of leasing versus buying a vehicle. This formula considers the purchase price, loan term, interest rate, lease term, monthly lease payments, and residual value. By calculating the total cost of both options, the formula provides a clear comparison, allowing users to make informed decisions. This approach is widely accepted in the automotive finance industry due to its accuracy and reliability.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Loan Cost = (Purchase Price × Monthly Interest Rate) / (1 - (1 + Monthly Interest Rate)^(-Loan Term × 12))
          <br />
          Total Lease Cost = (Monthly Lease Payment × Lease Term) + Residual Value
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Purchase Price = Cost of the vehicle</li>
              <li>Monthly Interest Rate = Annual Interest Rate / 12 / 100</li>
              <li>Loan Term = Duration of the loan in years</li>
              <li>Monthly Lease Payment = Monthly payment for leasing</li>
              <li>Lease Term = Duration of the lease in months</li>
              <li>Residual Value = Estimated value of the vehicle at the end of the lease</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the total cost. The purchase price and interest rate directly affect the loan cost, while the lease payment and residual value influence the lease cost. Understanding these variables helps users make better financial decisions. For instance, a higher interest rate increases the loan cost, while a higher residual value reduces the lease cost. By adjusting these variables, users can explore different scenarios and choose the best option for their financial situation.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence the Lease vs Buy Calculator results is essential for making informed decisions. These factors interact in complex ways, affecting the overall cost of leasing or buying a vehicle. By examining each factor, users can gain insights into how they impact the final decision.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Purchase Price
        </h3>
        <p className="mb-4">
          The purchase price is the initial cost of the vehicle, which significantly impacts the total cost of buying. A higher purchase price results in larger loan payments and a higher total loan cost. It's crucial to negotiate the best price possible to minimize these costs.
        </p>
        <p className="mb-6">
          When considering the purchase price, remember that it also affects the depreciation of the vehicle. A higher purchase price may lead to greater depreciation, impacting the vehicle's resale value. For more insights on managing purchase costs, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate determines the cost of borrowing money for a vehicle loan. A higher interest rate increases the total loan cost, making buying less attractive compared to leasing. It's important to shop around for the best interest rates to minimize these costs.
        </p>
        <p className="mb-6">
          Interest rates can vary based on credit scores and market conditions. Understanding how these rates fluctuate can help you secure a better deal. For more information on interest rates and their impact, visit our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Lease Term
        </h3>
        <p className="mb-4">
          The lease term is the duration of the lease agreement, typically ranging from 24 to 48 months. A longer lease term may result in lower monthly payments but could increase the total lease cost due to additional interest charges.
        </p>
        <p className="mb-6">
          It's essential to balance the lease term with your financial goals and vehicle usage. Consider how long you plan to keep the vehicle and whether a shorter or longer lease term aligns with your needs. For more guidance on lease terms, check out our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Monthly Lease Payment
        </h3>
        <p className="mb-6">
          The monthly lease payment is a critical factor in determining the total lease cost. Lower monthly payments can make leasing more attractive, but it's important to consider the overall cost, including the residual value and any additional fees. Negotiating a lower monthly payment can help reduce the total lease cost.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Residual Value
        </h3>
        <p className="mb-6">
          The residual value is the estimated worth of the vehicle at the end of the lease term. A higher residual value reduces the total lease cost by decreasing the depreciation amount. It's crucial to verify the residual value with your dealer to ensure accurate calculations.
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
              What is lease vs buy calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The Lease vs Buy Calculator is a tool that helps users compare the financial implications of leasing versus buying a vehicle. It evaluates the total cost of both options, considering factors like purchase price, loan term, interest rate, lease term, monthly lease payments, and residual value. This calculator is important because it provides a clear comparison, enabling users to make informed decisions about which option is more cost-effective in the long run.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              By understanding the total cost of ownership, users can avoid unexpected expenses and make better financial choices. For more information on related calculations, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The Lease vs Buy Calculator is designed to provide accurate estimates based on the inputs provided. However, the accuracy of the results depends on the accuracy of the input data. Factors such as fluctuating interest rates, changes in residual values, and additional fees can affect the final outcome. It's important to use the most current and accurate data available for the best results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For complex financial decisions, consider consulting with a financial advisor to ensure all factors are considered. Regularly updating your inputs can also help maintain accuracy.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use the Lease vs Buy Calculator, you'll need the following information: the vehicle's purchase price, the loan term in years, the annual interest rate, the lease term in months, the monthly lease payment, and the residual value of the vehicle. This data allows the calculator to provide a comprehensive comparison of the total cost of leasing versus buying.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              You can find this information in your loan or lease agreement, or by contacting your dealer or lender. Ensuring the accuracy of this data is crucial for obtaining reliable results.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for specific scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, the Lease vs Buy Calculator can be used for various scenarios, such as comparing different vehicle models, evaluating the impact of different interest rates, or assessing the cost of leasing versus buying over different terms. However, it's important to note that the calculator provides estimates based on the inputs provided, and actual costs may vary due to factors like maintenance, insurance, and taxes.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For more complex scenarios, consider consulting with a financial advisor or using additional tools like our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> for more detailed analysis.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include using outdated or incorrect input data, not considering additional costs like maintenance and insurance, and failing to account for changes in interest rates or residual values. These errors can lead to inaccurate results and potentially costly financial decisions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, ensure all input data is current and accurate, and consider consulting with a financial advisor for complex decisions. Regularly updating your calculations can also help maintain accuracy.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It's recommended to recalculate whenever there are significant changes in your financial situation, such as changes in interest rates, vehicle prices, or lease terms. Additionally, if you're considering a new vehicle purchase or lease, updating your calculations can help ensure you're making the most informed decision.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Regular recalculations can also help you stay on top of your financial goals and adjust your plans as needed. For more insights, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Once you've obtained the results from the Lease vs Buy Calculator, use them to compare the total cost of leasing versus buying. Consider how these costs align with your financial goals and budget. If leasing is more cost-effective, evaluate the terms and conditions of the lease agreement. If buying is preferable, consider the long-term benefits of ownership.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For further analysis, consult with a financial advisor or explore additional tools like our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> to understand the broader financial implications.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While the Lease vs Buy Calculator provides a comprehensive comparison, there are alternative methods for evaluating vehicle financing options. These include consulting with a financial advisor, using other online calculators, or conducting a detailed cost analysis based on your specific financial situation.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Each method has its pros and cons, and the best approach depends on your individual needs and preferences. For a broader perspective, consider exploring our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a> for additional insights.
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
                href="https://www.federalreserve.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Reserve - Vehicle Financing
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on vehicle financing and regulatory guidelines
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
                Consumer Financial Protection Bureau - Auto Loans
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on auto loans
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
                FDIC - Auto Financing
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information related to auto financing
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
                Internal Revenue Service - Vehicle Deductions
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information for vehicle expenses
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
                Investopedia - Leasing vs Buying a Car
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained for leasing vs buying a car
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
                NerdWallet - Car Buying Guide
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers considering car purchases
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
      title="Lease vs Buy Calculator"
      description="Compare the costs of leasing versus buying a car. Analyze monthly payments and long-term value to make the smartest financial decision."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Lease vs Buy Calculator" },
        { id: "formula", label: "Lease vs Buy Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Loan Cost = (Purchase Price × Monthly Interest Rate) / (1 - (1 + Monthly Interest Rate)^(-Loan Term × 12))",
        variables: [
          { symbol: "Purchase Price", description: "Cost of the vehicle" },
          { symbol: "Monthly Interest Rate", description: "Annual Interest Rate / 12 / 100" },
          { symbol: "Loan Term", description: "Duration of the loan in years" },
          { symbol: "Monthly Lease Payment", description: "Monthly payment for leasing" },
          { symbol: "Lease Term", description: "Duration of the lease in months" },
          { symbol: "Residual Value", description: "Estimated value of the vehicle at the end of the lease" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a vehicle with a purchase price of $30,000, a loan term of 5 years, and an interest rate of 3.5%. The lease term is 36 months with a monthly lease payment of $400 and a residual value of $15,000.",
        steps: [
          { 
            step: 1, 
            calculation: "Monthly Interest Rate = 3.5 / 12 / 100 = 0.0029167", 
            description: "Calculate the monthly interest rate from the annual rate." 
          },
          { 
            step: 2, 
            calculation: "Total Loan Cost = (30000 × 0.0029167) / (1 - (1 + 0.0029167)^(-60))", 
            description: "Determine the total cost of the loan using the formula." 
          },
          { 
            step: 3, 
            calculation: "Total Lease Cost = (400 × 36) + 15000 = $29,400", 
            description: "Calculate the total cost of leasing the vehicle." 
          }
        ],
        result: "The final result shows that the total loan cost is higher than the lease cost, indicating that leasing may be more cost-effective in this scenario."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💰" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💹" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}
