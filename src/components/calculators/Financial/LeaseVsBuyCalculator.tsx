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
    leasePayment: "" 
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
    const leaseTerm = parseFloat(inputs.leaseTerm) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
    const residualValue = parseFloat(inputs.residualValue) || 0;
    const leasePayment = parseFloat(inputs.leasePayment) || 0;

    // Validate
    if (purchasePrice <= 0 || leaseTerm <= 0 || interestRate <= 0) {
      return { 
        mainResult: 0, 
        totalLeaseCost: 0, 
        totalBuyCost: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyInterestRate = interestRate / 12;
    const totalLeaseCost = (leasePayment * leaseTerm) + residualValue;
    const totalBuyCost = purchasePrice + (purchasePrice * monthlyInterestRate * leaseTerm);

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: leaseTerm }, (_, i) => ({
      month: i + 1,
      leasePayment: leasePayment,
      interest: leasePayment * monthlyInterestRate,
      principal: leasePayment - (leasePayment * monthlyInterestRate),
      balance: purchasePrice - ((leasePayment - (leasePayment * monthlyInterestRate)) * (i + 1))
    }));

    return { 
      mainResult: totalLeaseCost < totalBuyCost ? totalLeaseCost : totalBuyCost, 
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
    setInputs({ purchasePrice: "", leaseTerm: "", interestRate: "", residualValue: "", leasePayment: "" });
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
              placeholder="e.g., 5"
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
              value={inputs.leasePayment}
              onChange={(e) => setInputs({ ...inputs, leasePayment: e.target.value })}
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
                      Total Cost Comparison
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
                            <TableCell>{formatCurrency(row.leasePayment)}</TableCell>
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
          The Lease vs Buy Calculator is an essential tool for anyone considering acquiring a vehicle. This calculator helps you compare the financial implications of leasing a car versus buying it outright. By inputting key variables such as purchase price, lease terms, interest rates, and residual values, you can determine which option is more cost-effective in the long run. Whether you're a first-time car buyer or looking to upgrade, understanding the financial impact of your decision is crucial.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in this domain as they directly affect your financial planning. An incorrect calculation could lead to unexpected expenses or missed savings opportunities. For instance, leasing might seem cheaper monthly, but buying could be more economical over time when considering factors like depreciation and interest. Our calculator provides a detailed breakdown, helping you make informed decisions. Check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> for more insights into financing options.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information such as the car's purchase price, expected lease term, applicable interest rate, and the residual value at the end of the lease. Enter these values into the respective fields to get a comprehensive comparison. The calculator will provide insights into monthly payments, total costs, and potential savings. For further guidance, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider the total cost of ownership, not just the monthly payments. Leasing might offer lower monthly payments, but buying could be more cost-effective in the long run if you plan to keep the car for many years. Evaluate your driving habits and financial goals to make the best decision.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include considering your driving habits, as leases often have mileage limits that can incur additional fees. Also, think about the car's depreciation rate and how it affects the residual value. These factors can significantly impact the overall cost. For more detailed financial planning, consider using our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Lease vs Buy Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Lease vs Buy Calculator uses a standard formula to evaluate the total cost of leasing versus buying a vehicle. This formula considers the purchase price, lease payments, interest rates, and residual value. By comparing these elements, the calculator determines which option is financially advantageous. The formula is widely accepted in the automotive finance industry and provides a reliable framework for decision-making.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Lease Cost = (Lease Payment × Lease Term) + Residual Value
          <br />
          Total Buy Cost = Purchase Price + (Purchase Price × Interest Rate × Lease Term)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Lease Payment = Monthly payment for the lease</li>
              <li>Lease Term = Duration of the lease in months</li>
              <li>Residual Value = Estimated value of the car at the end of the lease</li>
              <li>Purchase Price = Initial cost of the car if bought</li>
              <li>Interest Rate = Annual interest rate applicable to the loan</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining the total cost. The lease payment and term define the immediate financial commitment, while the residual value impacts the long-term cost. The purchase price and interest rate are crucial for calculating the total cost of buying. Adjusting these variables can significantly alter the outcome, highlighting the importance of accurate data input. For example, a higher interest rate increases the total buy cost, making leasing more attractive.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence the lease vs buy decision is crucial for making an informed choice. These factors interact in complex ways, affecting the overall cost and financial viability of each option. By examining each factor, you can tailor your decision to your unique circumstances and financial goals.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Depreciation Rate
        </h3>
        <p className="mb-4">
          Depreciation is the reduction in a car's value over time. It is a significant factor in the lease vs buy decision. Cars with high depreciation rates lose value quickly, making leasing a more attractive option. For example, luxury cars often depreciate faster, which can make leasing more cost-effective.
        </p>
        <p className="mb-6">
          To optimize this factor, research the depreciation rates of different car models. Choosing a car with a lower depreciation rate can make buying more appealing. For more insights, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Mileage Limits
        </h3>
        <p className="mb-4">
          Lease agreements often include mileage limits, which can incur additional fees if exceeded. This factor is crucial for those who drive extensively. Exceeding mileage limits can significantly increase the cost of leasing, making buying a more economical choice.
        </p>
        <p className="mb-6">
          Consider your driving habits and choose a lease plan that accommodates your mileage needs. Alternatively, buying a car eliminates these restrictions, offering more flexibility. For more detailed financial planning, consider using our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rates
        </h3>
        <p className="mb-4">
          Interest rates directly affect the cost of buying a car. Higher rates increase the total cost, making leasing more attractive. Conversely, low-interest rates can make buying more affordable. Understanding current market rates is essential for making an informed decision.
        </p>
        <p className="mb-6">
          Shop around for the best interest rates and consider refinancing options if rates drop. This can significantly reduce the total cost of buying. For more insights into managing interest rates, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Residual Value
        </h3>
        <p className="mb-6">
          The residual value is the estimated worth of the car at the end of the lease. It affects both the lease and buy decisions. A higher residual value lowers the total lease cost, making leasing more attractive. Conversely, a low residual value can make buying more appealing, as the car retains less value over time.
        </p>
        <p className="mb-6">
          Research the residual values of different car models and consider how they align with your financial goals. This can help you choose the most cost-effective option. For more detailed financial planning, consider using our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Implications
        </h3>
        <p className="mb-6">
          Tax implications can vary significantly between leasing and buying. Leasing may offer tax advantages for business use, while buying could provide benefits through deductions and credits. Understanding these implications is crucial for optimizing your financial strategy.
        </p>
        <p className="mb-6">
          Consult with a tax professional to understand the specific implications for your situation. This can help you make the most financially advantageous decision. For more insights into managing tax implications, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
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
              The lease vs buy calculator is a tool that helps individuals compare the financial implications of leasing a car versus buying it. It is important because it provides a clear understanding of the total costs associated with each option, allowing users to make informed decisions based on their financial goals and circumstances.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              By using this calculator, you can evaluate factors such as monthly payments, interest rates, and residual values to determine which option is more cost-effective. For more insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The calculator is designed to provide accurate estimates based on the inputs provided. However, its accuracy depends on the accuracy of the data entered. Factors such as fluctuating interest rates, changes in residual values, and unexpected fees can affect the final results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For the most accurate results, ensure that you input precise and up-to-date information. Consider consulting a financial advisor for personalized advice. For more insights, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you need to gather specific information about the car and the terms of the lease or purchase. This includes the purchase price, lease term, interest rate, residual value, and monthly lease payment. Accurate data is crucial for obtaining reliable results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              You can find this information in the car's sales agreement, lease contract, or by consulting with your financial institution. For more insights, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for [specific scenario]?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator is versatile and can be used for various scenarios, including comparing different car models, evaluating lease offers, and assessing the financial impact of different interest rates. However, it may not account for unique circumstances such as tax incentives or special promotions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For specific scenarios, consider consulting with a financial advisor or using additional tools to complement the calculator's results. For more insights, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include using outdated or incorrect data, not considering all costs (such as maintenance and insurance), and failing to account for changes in interest rates or residual values. These errors can lead to inaccurate results and poor financial decisions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, ensure that you gather accurate and current information before using the calculator. For more insights, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculation is recommended whenever there are significant changes in interest rates, residual values, or your financial situation. Regular recalculations ensure that you have the most accurate and up-to-date information for making informed decisions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider recalculating annually or whenever you are considering a new lease or purchase. For more insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to compare the financial implications of leasing versus buying a car. Consider how each option aligns with your financial goals and lifestyle. The results can guide you in making an informed decision that optimizes your financial resources.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If you're unsure about the results, consult with a financial advisor for personalized advice. For more insights, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives to this calculation method include consulting with financial advisors, using specialized software, or exploring online resources that offer different perspectives on leasing versus buying. Each alternative has its pros and cons, depending on your specific needs.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider using multiple methods to gain a comprehensive understanding of your options. For more insights, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
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
                Official data on auto financing and regulatory guidelines.
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
                Comprehensive consumer protection information and educational resources on auto loans.
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
                Banking regulations and deposit insurance information related to auto loans.
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
                Official tax guidelines and deduction information for vehicles.
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
                Investopedia - Car Leasing
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained, focusing on car leasing.
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
                Personal finance guides and comparison tools for consumers considering car purchases.
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
        formula: "Total Lease Cost = (Lease Payment × Lease Term) + Residual Value; Total Buy Cost = Purchase Price + (Purchase Price × Interest Rate × Lease Term)",
        variables: [
          { symbol: "Lease Payment", description: "Monthly payment for the lease" },
          { symbol: "Lease Term", description: "Duration of the lease in months" },
          { symbol: "Residual Value", description: "Estimated value of the car at the end of the lease" },
          { symbol: "Purchase Price", description: "Initial cost of the car if bought" },
          { symbol: "Interest Rate", description: "Annual interest rate applicable to the loan" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a car with a purchase price of $30,000, a lease term of 36 months, an interest rate of 5%, a residual value of $15,000, and a monthly lease payment of $400.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "400 × 36 = 14,400", 
            explanation: "Calculate the total lease payments over the term." 
          },
          { 
            label: "Step 2", 
            calculation: "14,400 + 15,000 = 29,400", 
            explanation: "Add the residual value to find the total lease cost." 
          },
          { 
            label: "Step 3", 
            calculation: "30,000 + (30,000 × 0.05 × 3) = 34,500", 
            explanation: "Calculate the total buy cost including interest." 
          }
        ],
        result: "The final result shows that leasing costs $29,400, while buying costs $34,500, indicating leasing is cheaper in this scenario."
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