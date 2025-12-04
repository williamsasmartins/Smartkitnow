import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function LeaseVsBuyCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    purchasePrice: "", 
    leaseTerm: "", 
    interestRate: "", 
    residualValue: "", 
    monthlyLeasePayment: "" 
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
    let purchasePrice = parseFloat(inputs.purchasePrice) || 0;
    const leaseTerm = parseInt(inputs.leaseTerm) || 0;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const residualValue = parseFloat(inputs.residualValue) || 0;
    const monthlyLeasePayment = parseFloat(inputs.monthlyLeasePayment) || 0;

    // Validate
    if (purchasePrice <= 0 || leaseTerm <= 0 || interestRate < 0 || residualValue < 0 || monthlyLeasePayment < 0) {
      return { 
        mainResult: 0, 
        totalLeaseCost: 0, 
        totalBuyCost: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalLeaseCost = monthlyLeasePayment * leaseTerm;
    const totalBuyCost = purchasePrice + (purchasePrice * (interestRate / 100) * (leaseTerm / 12)) - residualValue;
    const mainResult = totalLeaseCost - totalBuyCost;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: leaseTerm }, (_, i) => ({
      month: i + 1,
      leasePayment: monthlyLeasePayment,
      buyPayment: (purchasePrice / leaseTerm) + ((purchasePrice - residualValue) * (interestRate / 100) / 12),
      balance: purchasePrice - ((purchasePrice / leaseTerm) * (i + 1))
    }));

    return { 
      mainResult, 
      totalLeaseCost, 
      totalBuyCost, 
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
    setInputs({ purchasePrice: "", leaseTerm: "", interestRate: "", residualValue: "", monthlyLeasePayment: "" });
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
              <DollarSign className="w-4 h-4 text-blue-600"/>
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

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Monthly Lease Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 400"
              value={inputs.monthlyLeasePayment}
              onChange={(e) => setInputs({ ...inputs, monthlyLeasePayment: e.target.value })}
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
      {results.mainResult !== 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Cost Difference (Lease vs Buy)
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
                      {formatCurrency(results.totalLeaseCost)}
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
                      Total Buy Cost
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalBuyCost)}
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
                        <TableHead className="font-semibold">Lease Payment</TableHead>
                        <TableHead className="font-semibold">Buy Payment</TableHead>
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
                            <TableCell>{formatCurrency(row.leasePayment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.buyPayment)}
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
          Deciding whether to lease or buy a car is a significant financial decision that can impact your budget and lifestyle. The Lease vs Buy Calculator is designed to help you make an informed choice by comparing the costs associated with leasing a vehicle versus purchasing it outright. This tool considers various factors such as the purchase price, lease terms, interest rates, and residual values to provide a comprehensive analysis of both options. By using this calculator, you can gain insights into the long-term financial implications of each choice, allowing you to align your decision with your financial goals and preferences.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the realm of automotive financing. A miscalculation could lead to unexpected expenses or missed opportunities for savings. For instance, understanding the true cost of leasing versus buying can prevent you from overcommitting financially or missing out on potential equity gains from owning a vehicle. This calculator helps mitigate such risks by providing precise estimates based on your inputs. It empowers you to make decisions that are not only financially sound but also aligned with your personal circumstances. For more insights on financial planning, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the Lease vs Buy Calculator effectively, gather information such as the vehicle's purchase price, the lease term in months, the applicable interest rate, the car's residual value at the end of the lease, and the monthly lease payment. Enter these values into the calculator to receive a detailed comparison of the total costs associated with leasing versus buying. This tool is user-friendly and provides results in a format that is easy to interpret, helping you make a well-informed decision. For additional resources, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            When deciding between leasing and buying, consider your driving habits and lifestyle. Leasing might be more cost-effective if you prefer driving a new car every few years without the hassle of selling an old one. However, buying could be advantageous if you plan to keep the vehicle long-term and want to build equity. Always evaluate your personal needs and financial situation before making a decision.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating the inputs to reflect current market conditions and personal financial changes. For instance, interest rates can fluctuate, affecting the overall cost of buying a car. Additionally, consider the impact of mileage limits on lease agreements, as exceeding these can incur additional fees. By staying informed and adjusting your calculations accordingly, you can optimize your financial strategy and make the most of your automotive investment.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Lease vs Buy Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Lease vs Buy Calculator employs a straightforward yet effective formula to evaluate the financial implications of leasing versus purchasing a vehicle. This formula considers the total lease cost, which is the sum of all monthly lease payments over the lease term, and the total buy cost, which includes the purchase price, interest payments, and the residual value of the vehicle. By comparing these two figures, the calculator provides a clear picture of which option is more cost-effective based on your inputs.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Lease Cost = Monthly Lease Payment × Lease Term
          <br />
          Total Buy Cost = Purchase Price + (Purchase Price × (Interest Rate / 100) × (Lease Term / 12)) - Residual Value
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Monthly Lease Payment = The monthly amount paid for leasing the vehicle</li>
              <li>Lease Term = The duration of the lease in months</li>
              <li>Purchase Price = The initial cost of buying the vehicle</li>
              <li>Interest Rate = The annual interest rate applied to the loan</li>
              <li>Residual Value = The estimated value of the vehicle at the end of the lease</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the overall cost. The Monthly Lease Payment is typically lower than a loan payment, making leasing attractive for those with budget constraints. However, the Purchase Price and Interest Rate significantly impact the Total Buy Cost, especially if you plan to keep the vehicle long-term. The Residual Value affects both options, as a higher residual value can lower lease payments and increase potential resale value for buyers. Adjusting these variables allows you to explore different financial scenarios and choose the best option for your needs.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence the Lease vs Buy decision is essential for making an informed choice. These factors interact in complex ways, affecting the overall cost and benefits of each option. By examining these elements, you can tailor your decision to fit your financial situation and lifestyle preferences.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Purchase Price
        </h3>
        <p className="mb-4">
          The purchase price is the initial cost of buying the vehicle and is a significant factor in the total cost of ownership. A higher purchase price increases the amount financed and the interest paid over the loan term. It's crucial to negotiate the best possible price to minimize these costs. Consider the vehicle's features, brand reputation, and market demand when determining a fair purchase price.
        </p>
        <p className="mb-6">
          To optimize this factor, research comparable vehicles and use online tools to estimate fair market value. Additionally, consider timing your purchase to coincide with dealer promotions or end-of-year sales events. For more strategies on managing purchase costs, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Lease Term
        </h3>
        <p className="mb-4">
          The lease term is the duration of the lease agreement, typically ranging from 24 to 48 months. A longer lease term can lower monthly payments but may result in higher overall costs due to additional fees and depreciation. It's essential to balance the lease term with your driving habits and future plans.
        </p>
        <p className="mb-6">
          Consider your lifestyle and how often you prefer to change vehicles when selecting a lease term. Shorter terms offer more flexibility, while longer terms may be more cost-effective if you plan to keep the car for the entire duration. For more insights on lease terms, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is a critical factor in determining the cost of financing a vehicle purchase. A lower interest rate reduces the total interest paid over the loan term, making buying more affordable. Interest rates vary based on credit score, loan term, and market conditions.
        </p>
        <p className="mb-6">
          To secure the best interest rate, maintain a strong credit score and shop around for competitive offers. Consider pre-approval from multiple lenders to compare rates and terms. For more tips on managing interest rates, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Residual Value
        </h3>
        <p className="mb-6">
          The residual value is the estimated worth of the vehicle at the end of the lease term. A higher residual value can lower lease payments and increase the potential resale value for buyers. This factor is influenced by the vehicle's make, model, and expected depreciation rate. Understanding how residual value impacts costs can help you make a more informed decision.
        </p>
        <p className="mb-6">
          To maximize residual value, choose vehicles with strong resale value and low depreciation rates. Consider factors such as brand reputation, reliability, and market trends when evaluating residual value. For more guidance on maximizing residual value, visit our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Monthly Lease Payment
        </h3>
        <p className="mb-6">
          The monthly lease payment is the amount paid each month for leasing the vehicle. This payment is influenced by the vehicle's purchase price, residual value, and lease term. Lower monthly payments can make leasing more attractive, especially for those with budget constraints. However, it's essential to consider the total lease cost over the lease term.
        </p>
        <p className="mb-6">
          To manage monthly lease payments effectively, negotiate the purchase price and residual value, and consider making a larger down payment. Additionally, be aware of any additional fees or charges that may affect the total lease cost. For more advice on managing lease payments, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
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
              A Lease vs Buy Calculator is a tool that helps individuals compare the financial implications of leasing a vehicle versus purchasing it. This calculator is crucial for making informed decisions about car ownership, as it provides a detailed analysis of the costs associated with each option. By understanding the total cost of leasing and buying, users can choose the option that best fits their financial situation and lifestyle preferences.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              This tool is particularly important for those who are undecided about their vehicle financing options. It offers a clear comparison of the long-term costs and benefits of each choice, helping users avoid unexpected expenses and make financially sound decisions. For more insights, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The Lease vs Buy Calculator is designed to provide accurate estimates based on the inputs provided by the user. However, the accuracy of the results depends on the accuracy of the input data. Factors such as interest rates, residual values, and market conditions can affect the final calculations. It's important to use up-to-date and reliable data to ensure the most accurate results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              While the calculator offers a solid foundation for decision-making, users should also consider consulting with financial advisors or automotive experts for personalized advice. This ensures that all potential variables and personal circumstances are taken into account.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use the Lease vs Buy Calculator effectively, you will need several key pieces of information. These include the vehicle's purchase price, the lease term in months, the applicable interest rate, the residual value of the vehicle at the end of the lease, and the monthly lease payment. Having accurate and up-to-date data for these inputs is crucial for obtaining reliable results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              You can typically find this information in the vehicle's financing or leasing agreement, or by consulting with your dealership or lender. Additionally, online resources and financial tools can provide estimates for interest rates and residual values based on current market conditions.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for specific scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, the Lease vs Buy Calculator can be used for a variety of scenarios. Whether you're considering a new or used vehicle, this tool can help you evaluate the financial implications of leasing versus buying. It is particularly useful for comparing different vehicles or financing options, allowing you to see how changes in purchase price, interest rates, or lease terms affect the overall cost.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              However, it's important to note that the calculator provides estimates based on the inputs you provide. For more complex scenarios, such as those involving trade-ins or special financing offers, additional calculations or professional advice may be needed to fully understand the financial impact.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              One common mistake is underestimating the total cost of leasing by focusing solely on the lower monthly payments. While leasing can offer lower payments, the total cost over the lease term may be higher due to fees and lack of equity. Another mistake is failing to account for the residual value when calculating the cost of buying, which can lead to inaccurate comparisons.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these errors, ensure that all relevant factors are considered and that the input data is accurate. Additionally, be aware of any additional fees or charges associated with leasing or buying, as these can significantly impact the overall cost.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It's advisable to recalculate whenever there are significant changes in market conditions or personal financial circumstances. For example, fluctuations in interest rates or changes in your credit score can affect the cost of financing a vehicle. Additionally, if you're considering different vehicles or financing options, recalculating can help you compare the costs and benefits of each choice.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Regularly updating your calculations ensures that you have the most accurate and relevant information for making informed decisions. Consider setting a schedule to review your calculations periodically, especially if you're actively shopping for a vehicle.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Once you have the results from the Lease vs Buy Calculator, use them to guide your decision-making process. Compare the total costs of leasing and buying to determine which option aligns best with your financial goals and lifestyle preferences. Consider factors such as your budget, driving habits, and future plans when interpreting the results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If you're unsure about the implications of the results, consider consulting with a financial advisor or automotive expert for personalized advice. They can provide additional insights and help you make a decision that best suits your needs. For more guidance, visit our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While the Lease vs Buy Calculator provides a comprehensive analysis of the costs associated with each option, there are alternative methods for evaluating vehicle financing decisions. For example, some individuals prefer to consult with financial advisors or use detailed spreadsheets to account for all potential variables and scenarios. These methods can offer more personalized insights and consider factors that may not be included in a standard calculator.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              However, these alternatives may require more time and expertise to implement effectively. The Lease vs Buy Calculator remains a valuable tool for quickly and easily comparing the costs of leasing and buying, providing a solid foundation for making informed decisions.
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
                Federal Reserve - Auto Financing
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on auto financing trends and interest rate guidelines.
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
                Consumer Financial Protection Bureau - Leasing Guide
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive guide on consumer rights and considerations in vehicle leasing.
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
                FDIC - Auto Loan Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and best practices for auto loans and financing.
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
                Internal Revenue Service - Vehicle Tax Deductions
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information for vehicle expenses.
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
                Investopedia - Leasing vs Buying
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education on the pros and cons of leasing versus buying a vehicle.
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
                Personal finance guides and comparison tools for car buyers and lessees.
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
      onThisPage={[
        { id: "introduction", label: "Understanding Lease vs Buy Calculator" },
        { id: "formula", label: "Lease vs Buy Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Lease Cost = Monthly Lease Payment × Lease Term\nTotal Buy Cost = Purchase Price + (Purchase Price × (Interest Rate / 100) × (Lease Term / 12)) - Residual Value",
        variables: [
          { symbol: "Monthly Lease Payment", description: "The monthly amount paid for leasing the vehicle" },
          { symbol: "Lease Term", description: "The duration of the lease in months" },
          { symbol: "Purchase Price", description: "The initial cost of buying the vehicle" },
          { symbol: "Interest Rate", description: "The annual interest rate applied to the loan" },
          { symbol: "Residual Value", description: "The estimated value of the vehicle at the end of the lease" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a vehicle with a purchase price of $30,000, a lease term of 36 months, an interest rate of 3.5%, a residual value of $15,000, and a monthly lease payment of $400.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "400 × 36 = 14,400", 
            explanation: "Calculate the total lease cost by multiplying the monthly lease payment by the lease term." 
          },
          { 
            label: "Step 2", 
            calculation: "30,000 + (30,000 × 0.035 × 3) - 15,000 = 18,150", 
            explanation: "Determine the total buy cost by adding the purchase price, interest, and subtracting the residual value." 
          },
          { 
            label: "Step 3", 
            calculation: "14,400 - 18,150 = -3,750", 
            explanation: "The final result shows that leasing is $3,750 cheaper than buying in this scenario." 
          }
        ],
        result: "The final result is -$3,750, meaning leasing is more cost-effective than buying in this example."
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