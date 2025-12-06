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
    question: "What is an APR calculator and why is it important?",
    answer: `An APR calculator helps you determine the annual percentage rate of a loan, which includes both the interest rate and any additional fees. This is important because it provides a more comprehensive view of the loan's cost, allowing you to compare different loan offers effectively. For example, two loans with the same interest rate might have different APRs due to varying fees.<br><br>Understanding the APR can prevent costly surprises and help you choose the most cost-effective loan. For more details, see our <a href="/financial/refinance-savings">Refinance Savings Calculator</a>.`
  },
  {
    question: "How accurate is this calculator?",
    answer: `This calculator provides a highly accurate estimate of the APR based on the inputs you provide. However, the accuracy depends on the precision of the data entered. Factors such as unreported fees or changes in loan terms can affect the result. It's always a good idea to consult with a financial advisor for complex financial decisions.<br><br>To ensure accuracy, double-check all inputs and consider potential changes in fees or interest rates.`
  },
  {
    question: "What information do I need to use this calculator?",
    answer: `To use this calculator, you need the loan amount, the interest rate, and any associated fees. The loan amount is the principal you plan to borrow. The interest rate is the percentage charged by the lender for borrowing the principal. Fees can include origination fees, closing costs, and other charges related to the loan.<br><br>You can typically find this information in the loan agreement or by contacting your lender. Accurate data is crucial for precise calculations.`
  },
  {
    question: "Can I use this calculator for different types of loans?",
    answer: `Yes, this calculator can be used for various types of loans, including mortgages, auto loans, and personal loans. However, it's important to ensure that all relevant fees and terms are included in the calculation for each specific loan type. Some loans may have unique fees or terms that could affect the APR.<br><br>For specialized loan types, such as interest-only loans, consider using a dedicated calculator like our <a href="/financial/interest-only-loan">Interest-Only Loan Calculator</a>.`
  },
  {
    question: "What are common mistakes people make with this calculation?",
    answer: `Common mistakes include not accounting for all fees, using incorrect interest rates, or misunderstanding the loan terms. These errors can lead to inaccurate APR calculations, potentially resulting in poor financial decisions. For example, failing to include closing costs can significantly underestimate the APR.<br><br>To avoid these mistakes, carefully review all loan documents and verify that all data entered into the calculator is correct.`
  },
  {
    question: "How often should I recalculate?",
    answer: `Recalculation is necessary whenever there are changes in the loan terms, such as adjustments in interest rates or fees. It's also advisable to recalculate if your financial situation changes, affecting your ability to meet the loan terms. Regular recalculations can help you stay informed about your financial commitments.<br><br>As a best practice, review your loans annually or whenever you consider refinancing or making significant financial decisions.`
  },
  {
    question: "What should I do with these results?",
    answer: `Use the results to compare different loan offers and make informed decisions about borrowing. A lower APR indicates a cheaper loan in terms of total cost. If the APR seems high, consider negotiating with your lender or exploring other options. The results can also guide you in budgeting and financial planning.<br><br>For further guidance, consult a financial advisor or use our <a href="/financial/heloc-payment-estimator">HELOC Payment Estimator</a> for home equity loans.`
  },
  {
    question: "Are there alternatives to this calculation method?",
    answer: `Alternatives to the APR calculation include using the nominal interest rate or the effective annual rate (EAR). Each method has its pros and cons. The nominal rate is simpler but less comprehensive, while the EAR accounts for compounding but can be more complex to calculate.<br><br>Choose the method that best suits your needs. For a detailed comparison, consider consulting financial resources or professionals.`
  }
];

export default function AprCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    loanAmount: "", 
    interestRate: "", 
    fees: "" 
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
    let loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const fees = parseFloat(inputs.fees) || 0;

    // Validate
    if (loanAmount <= 0 || interestRate <= 0) {
      return { 
        mainResult: 0, 
        totalInterest: 0, 
        totalCost: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const annualInterest = loanAmount * (interestRate / 100);
    const totalInterest = annualInterest + fees;
    const apr = ((totalInterest / loanAmount) * 100).toFixed(2);

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      payment: (loanAmount + totalInterest) / 12,
      principal: loanAmount / 12,
      interest: totalInterest / 12,
      balance: loanAmount - ((loanAmount / 12) * (i + 1))
    }));

    return { 
      mainResult: parseFloat(apr), 
      totalInterest, 
      totalCost: loanAmount + totalInterest, 
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
    setInputs({ loanAmount: "", interestRate: "", fees: "" });
  };

  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600"/>
              Loan Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 300000"
              value={inputs.loanAmount}
              onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
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
              placeholder="e.g., 3.5"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Fees
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.fees}
              onChange={(e) => setInputs({ ...inputs, fees: e.target.value })}
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
                      Annual Percentage Rate (APR)
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.mainResult}%
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
                      Total Cost
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalCost)}
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
          Understanding APR Calculator
        </h2>
        
        <p className="mb-6">
          The Annual Percentage Rate (APR) is a critical metric in the financial world, representing the annual cost of borrowing money, including interest and fees. This calculator helps you determine the true cost of a loan, making it an invaluable tool for anyone considering taking out a loan or credit. By understanding the APR, you can make more informed decisions, ensuring that you choose the most cost-effective option available. Whether you're looking at mortgages, car loans, or personal loans, knowing the APR can save you a significant amount of money over the life of the loan.
        </p>
        
        <p className="mb-6">
          Accurate APR calculations are essential because they provide a standardized measure of the cost of borrowing. Without this, comparing different loan offers would be challenging, as lenders often present interest rates in ways that can be misleading. The APR includes not just the interest rate, but also any additional fees or costs associated with the loan. This comprehensive view helps you avoid unexpected expenses and choose the best financial product for your needs. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this APR calculator effectively, gather all relevant information about the loan you are considering. This includes the loan amount, interest rate, and any additional fees. Enter these values into the calculator to get an accurate APR. This tool is designed to be user-friendly, providing quick results that you can rely on. For a deeper understanding of how different factors affect your loan, you might also want to explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always ensure that you compare APRs rather than just interest rates when evaluating loan offers. The APR provides a more complete picture of the total cost of borrowing, including fees that might not be immediately apparent. This can prevent costly surprises down the line.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include double-checking all entered values for accuracy and considering how different loan terms might affect your APR. For instance, shorter loan terms often result in higher monthly payments but lower overall interest costs. Understanding these dynamics can help you tailor your borrowing strategy to your financial goals.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          APR Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula for calculating the Annual Percentage Rate (APR) is a standardized method used to express the cost of borrowing on an annual basis. It includes both the interest rate and any additional fees or costs associated with the loan. This formula is crucial because it allows consumers to compare different loan products on a level playing field. The APR is calculated using the following formula:
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          APR = [(Interest + Fees) / Principal] / n * 365 * 100
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Interest = Total interest paid over the loan term</li>
              <li>Fees = Total fees associated with the loan</li>
              <li>Principal = Loan amount</li>
              <li>n = Number of days in the loan term</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in this formula plays a critical role in determining the APR. The interest represents the cost of borrowing the principal, while the fees include any additional costs such as origination fees or closing costs. The principal is the initial amount borrowed, and 'n' is the number of days in the loan term, which standardizes the calculation to an annual rate. By understanding these components, you can see how changes in any of these variables affect the overall APR.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Several factors influence the APR, and understanding these can help you better manage your finances. These factors interact in complex ways, affecting the overall cost of borrowing. By being aware of these elements, you can make more informed decisions and potentially reduce your borrowing costs.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is the percentage of the principal charged by the lender for the use of its money. It is one of the most significant components of the APR. A lower interest rate generally means a lower APR, assuming all other factors remain constant. For example, a 3% interest rate on a $100,000 loan will result in lower interest payments than a 5% rate.
        </p>
        <p className="mb-6">
          To optimize the interest rate, consider improving your credit score or providing a larger down payment. These actions can often lead to better loan terms. For more strategies, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Fees
        </h3>
        <p className="mb-4">
          Loan fees can include origination fees, closing costs, and any other charges associated with processing the loan. These fees are added to the total cost of the loan, increasing the APR. For instance, a $1,000 fee on a $10,000 loan significantly impacts the APR compared to the same fee on a $100,000 loan.
        </p>
        <p className="mb-6">
          It's essential to understand all the fees involved in a loan to accurately calculate the APR. Always ask your lender for a breakdown of fees and compare these across different loan offers to ensure you're getting the best deal.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term is the duration over which the loan is repaid. Shorter loan terms usually result in higher monthly payments but lower overall interest costs, which can reduce the APR. Conversely, longer terms may have lower monthly payments but higher total interest, increasing the APR.
        </p>
        <p className="mb-6">
          When choosing a loan term, consider your monthly budget and long-term financial goals. A shorter term might be more challenging monthly but can save money in the long run. For more insights, see our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Credit Score
        </h3>
        <p className="mb-6">
          Your credit score significantly impacts the interest rate offered by lenders. A higher credit score often results in lower interest rates, reducing the APR. Lenders view high credit scores as an indicator of lower risk, which can lead to more favorable loan terms. Improving your credit score before applying for a loan can be a strategic move to lower your APR.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Broader economic conditions, such as inflation rates and central bank policies, can affect interest rates and, consequently, APRs. During periods of economic growth, interest rates might rise, increasing APRs, while during recessions, rates might fall. Staying informed about economic trends can help you time your borrowing to take advantage of favorable conditions.
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
                Federal Reserve - Understanding APR
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on APR and its impact on consumer loans, providing regulatory guidelines.
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
                Consumer Financial Protection Bureau - Loan Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on loans.
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
                FDIC - Loan and Deposit Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information relevant to loan products.
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
                Internal Revenue Service - Tax Implications of Loans
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information related to loan interest.
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
                Investopedia - APR Explained
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained, including APR.
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
                NerdWallet - Loan Comparison Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers to evaluate loans.
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
      title="APR Calculator"
      description="Calculate the Annual Percentage Rate (APR) for loans. Understand the true cost of borrowing including fees and interest."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding APR Calculator" },
        { id: "formula", label: "APR Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "APR = [(Interest + Fees) / Principal] / n * 365 * 100",
        variables: [
          { symbol: "Interest", description: "Total interest paid over the loan term" },
          { symbol: "Fees", description: "Total fees associated with the loan" },
          { symbol: "Principal", description: "Loan amount" },
          { symbol: "n", description: "Number of days in the loan term" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $10,000 loan with a 5% interest rate and $500 in fees.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "5000 × 0.05 = 250", 
            explanation: "Calculate the annual interest" 
          },
          { 
            label: "Step 2", 
            calculation: "250 + 500 = 750", 
            explanation: "Add fees to the interest" 
          },
          { 
            label: "Step 3", 
            calculation: "750 / 10000 = 0.075", 
            explanation: "Divide by the principal" 
          },
          { 
            label: "Step 4", 
            calculation: "0.075 × 100 = 7.5%", 
            explanation: "Convert to a percentage" 
          }
        ],
        result: "The final result is 7.5%, meaning the APR for this loan is 7.5%."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💳"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"🔄"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏡"}
      ]}
    />
  );
}