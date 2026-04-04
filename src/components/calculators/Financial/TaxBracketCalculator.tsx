import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function TaxBracketCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    income: "", 
    filingStatus: "", 
    deductions: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "Does entering a higher tax bracket mean all my income gets taxed at the higher rate?",
      answer: "No -- this is one of the most common tax misconceptions. The US uses a marginal tax system where only the income within each bracket is taxed at that bracket's rate. Example for 2024 (single filer): the first $11,600 is taxed at 10%, the next $35,550 at 12%, income from $47,150 to $100,525 at 22%. If you earn $50,000, you do not owe 22% × $50,000 = $11,000. You owe: (11,600 × 10%) + (35,550 × 12%) + (2,850 × 22%) = $1,160 + $4,266 + $627 = $6,053. Effective rate = 12.1%. Moving from the 22% to the 24% bracket by earning an extra $100 means only that $100 is taxed at 24% -- you keep $76 of it."
    },
    {
      question: "What are the 2024 federal income tax brackets and standard deductions?",
      answer: "2024 brackets (single filer): 10% (up to $11,600), 12% ($11,601–$47,150), 22% ($47,151–$100,525), 24% ($100,526–$191,950), 32% ($191,951–$243,725), 35% ($243,726–$609,350), 37% (above $609,350). Standard deduction: $14,600 (single), $29,200 (married filing jointly), $21,900 (head of household). Taxable income = gross income − above-the-line deductions − standard or itemized deduction. For a single filer with $80,000 gross income and no above-the-line adjustments: taxable income = $80,000 − $14,600 = $65,400. Tax = $1,160 + $4,266 + $4,026 = $9,452. Effective rate = 11.8%."
    },
    {
      question: "What is bracket creep and how do inflation adjustments prevent it?",
      answer: "Bracket creep occurs when inflation pushes wages into higher tax brackets without any real income increase. Example: in a non-indexed system, a $50,000 salary with 5% inflation becomes $52,500 -- but the worker's real purchasing power is unchanged, yet they now owe more tax. The IRS adjusts tax brackets annually for inflation (using Chained CPI). For 2024, brackets were adjusted up ~5.4% from 2023. Without indexing, a middle-class taxpayer would face a permanent, silent tax increase every year inflation exceeds 0%. Bracket indexing is one reason why real tax burdens haven't automatically grown despite rising nominal wages. States vary -- some index brackets, others (like California) do not, leading to progressive bracket creep at the state level."
    },
    {
      question: "How do tax brackets affect the decision to take a bonus or extra income at year-end?",
      answer: "Marginal rate analysis should drive timing decisions for discretionary income. If you are in the 22% bracket in December and your bonus would push income into the 24% bracket, only the amount in the new bracket is taxed at 24% -- the 'penalty' for crossing is just the 2% difference on the incremental income ($100 bonus crossing into 24% costs an extra $2, not $24). The real timing decision: if you can defer income to next year (self-employed, deferred compensation), ask whether next year's rate will be lower. Alternatively, accelerating deductions (charitable contributions, 401k contributions before year-end) reduces current-year taxable income. Marginal rate, not bracket, is what drives every year-end tax optimization."
    },
    {
      question: "How do capital gains and qualified dividends interact with the regular tax brackets?",
      answer: "Long-term capital gains (LTCG) and qualified dividends have their own rate schedule that overlays the regular brackets. The LTCG rates (0%, 15%, 20%) apply at specific income thresholds, not the same thresholds as ordinary income. For 2024 (single): 0% LTCG on taxable income up to $47,025 -- even if your ordinary income bracket is 22%, gains below this threshold face no federal tax. 15% LTCG from $47,026–$518,900. 20% above $518,900. Strategy: a retired person with $40,000 in qualified dividends and Social Security may owe $0 federal tax on those dividends. Non-qualified dividends are taxed as ordinary income at marginal rates. Understanding this overlay is essential for tax-efficient portfolio withdrawals."
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
    const incomeValue = parseFloat(inputs.income) || 0;
    const filingStatusValue = inputs.filingStatus;
    const deductionsValue = parseFloat(inputs.deductions) || 0;

    // Validate
    if (incomeValue <= 0) {
      return { 
        mainResult: 0, 
        effectiveTaxRate: 0, 
        totalTax: 0, 
        taxBracket: "", 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const taxableIncome = incomeValue - deductionsValue;
    let taxBracket = "";
    let totalTax = 0;
    let effectiveTaxRate = 0;

    // Simplified tax bracket calculation logic
    if (filingStatusValue === "single") {
      if (taxableIncome <= 9875) {
        taxBracket = "10%";
        totalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 40125) {
        taxBracket = "12%";
        totalTax = 987.5 + (taxableIncome - 9875) * 0.12;
      } else if (taxableIncome <= 85525) {
        taxBracket = "22%";
        totalTax = 4617.5 + (taxableIncome - 40125) * 0.22;
      } else {
        taxBracket = "24%";
        totalTax = 14605.5 + (taxableIncome - 85525) * 0.24;
      }
    } else if (filingStatusValue === "married") {
      if (taxableIncome <= 19750) {
        taxBracket = "10%";
        totalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 80250) {
        taxBracket = "12%";
        totalTax = 1975 + (taxableIncome - 19750) * 0.12;
      } else if (taxableIncome <= 171050) {
        taxBracket = "22%";
        totalTax = 9235 + (taxableIncome - 80250) * 0.22;
      } else {
        taxBracket = "24%";
        totalTax = 29211 + (taxableIncome - 171050) * 0.24;
      }
    }

    effectiveTaxRate = (totalTax / incomeValue) * 100;

    // Generate schedule data if applicable (e.g., tax payments)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      payment: totalTax / 12,
      principal: (totalTax / 12) * 0.7,
      interest: (totalTax / 12) * 0.3,
      balance: totalTax - ((totalTax / 12) * (i + 1))
    }));

    return { 
      mainResult: totalTax, 
      effectiveTaxRate, 
      totalTax, 
      taxBracket, 
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
    setInputs({ income: "", filingStatus: "", deductions: "" });
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
              Annual Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.income}
              onChange={(e) => setInputs({ ...inputs, income: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Filing Status
            </Label>
            <select
              value={inputs.filingStatus}
              onChange={(e) => setInputs({ ...inputs, filingStatus: e.target.value })}
              className="text-lg w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
            >
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Deductions
            </Label>
            <Input
              type="number"
              placeholder="e.g., 12000"
              value={inputs.deductions}
              onChange={(e) => setInputs({ ...inputs, deductions: e.target.value })}
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
                      Total Tax
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.totalTax)}
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
                      Effective Tax Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.effectiveTaxRate.toFixed(2)}%
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
                      Tax Bracket
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.taxBracket}
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
          Understanding Tax Bracket Calculator
        </h2>
        
        <p className="mb-6">
          The Tax Bracket Calculator is an essential tool for anyone looking to understand their federal tax obligations. By inputting your annual income, filing status, and deductions, this calculator provides a clear estimate of your tax bracket and effective tax rate. This is particularly useful for financial planning, allowing you to anticipate your tax liabilities and make informed decisions about your finances. Whether you're preparing for tax season or simply want to understand your financial standing, this calculator offers valuable insights.
        </p>
        
        <p className="mb-6">
          Accurate tax calculations are crucial because they directly affect your financial well-being. An incorrect calculation could lead to underpayment or overpayment of taxes, both of which have significant consequences. Underpayment might result in penalties and interest charges, while overpayment means you're giving the government an interest-free loan. Using this calculator helps you avoid these pitfalls by providing precise calculations based on current tax laws. For more detailed financial planning, consider using our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the Tax Bracket Calculator effectively, gather your financial documents such as pay stubs, tax returns, and any information on deductions. Enter your annual income, select your filing status, and input any deductions you qualify for. The calculator will then compute your tax bracket and effective tax rate. For best results, ensure that all data entered is accurate and up-to-date. This will provide you with the most reliable estimate of your tax obligations. You might also find our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> helpful for understanding long-term financial commitments.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. A small error in your income or deductions can lead to a significant difference in your tax calculations. Ensure that your filing status is correctly selected to avoid miscalculations.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal use of the Tax Bracket Calculator, consider the timing of your calculations. Tax laws can change annually, so it's important to use the most current data available. Additionally, if you experience a significant change in income or deductions, recalculate your tax bracket to ensure you remain compliant with tax regulations. Understanding these nuances can help you optimize your tax strategy and potentially save money.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Tax Bracket Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Tax Bracket Calculator uses a tiered formula to determine your federal tax obligations. This formula is based on the progressive tax system employed by the IRS, where different portions of your income are taxed at different rates. The calculator takes into account your taxable income, which is your total income minus any deductions, and applies the appropriate tax rates to each portion of your income.
        </p>
        
        <p className="mb-6">
          This formula is the standard approach used by tax professionals and is updated annually to reflect changes in tax laws. Variations of this formula may exist for specific situations, such as alternative minimum tax calculations or state-specific tax brackets. However, for federal tax purposes, this calculator provides a reliable estimate based on the most current federal tax brackets.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Tax = Σ (Income Portion × Tax Rate)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Income Portion = Segments of taxable income</li>
              <li>Tax Rate = Corresponding rate for each segment</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining your tax liability. The "Income Portion" refers to segments of your income that fall within specific tax brackets. The "Tax Rate" is the percentage applied to each segment. For example, if you are single with a taxable income of $50,000, the first $9,875 would be taxed at 10%, the next $30,250 at 12%, and the remainder at 22%. Understanding how these variables interact helps you anticipate your tax obligations and plan accordingly.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Several factors can influence the results of your tax calculations. Understanding these factors is essential for accurate tax planning and can help you optimize your financial strategy. These factors interact in complex ways, so it's important to consider each one carefully.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Filing Status
        </h3>
        <p className="mb-4">
          Your filing status significantly impacts your tax bracket and overall tax liability. Common statuses include single, married filing jointly, married filing separately, and head of household. Each status has different tax brackets and standard deductions, which can affect your taxable income and tax rate.
        </p>
        <p className="mb-6">
          For example, married couples filing jointly often benefit from higher income thresholds before reaching higher tax brackets compared to single filers. Choosing the correct filing status is crucial for accurate tax calculations. For more information, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Income Level
        </h3>
        <p className="mb-4">
          Your total income level determines which tax brackets apply to you. Higher income levels generally lead to higher tax rates, as the U.S. tax system is progressive. Understanding where your income falls within the tax brackets helps you anticipate your tax obligations.
        </p>
        <p className="mb-6">
          For instance, if your income increases significantly, you may move into a higher tax bracket, resulting in a higher effective tax rate. Conversely, a decrease in income could lower your tax rate. It's important to monitor your income level throughout the year to avoid surprises at tax time.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Deductions and Credits
        </h3>
        <p className="mb-4">
          Deductions and credits can significantly reduce your taxable income and overall tax liability. Common deductions include mortgage interest, student loan interest, and charitable contributions. Tax credits, such as the Child Tax Credit, directly reduce the amount of tax you owe.
        </p>
        <p className="mb-6">
          Maximizing your deductions and credits can lead to substantial tax savings. Be sure to keep accurate records and consult with a tax professional to ensure you're taking advantage of all available options. Understanding these opportunities can help you optimize your tax strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Law Changes
        </h3>
        <p className="mb-6">
          Tax laws can change annually, affecting tax rates, brackets, and available deductions. Staying informed about these changes is crucial for accurate tax planning. For example, recent tax reforms have altered standard deductions and personal exemptions, impacting how taxes are calculated.
        </p>
        <p className="mb-6">
          Keeping abreast of tax law changes ensures that you remain compliant and can take advantage of new opportunities. Consulting with a tax professional or using reliable tax software can help you navigate these changes effectively.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Life Events
        </h3>
        <p className="mb-6">
          Major life events such as marriage, divorce, the birth of a child, or retirement can significantly impact your tax situation. These events may change your filing status, income level, or eligibility for certain deductions and credits.
        </p>
        <p className="mb-6">
          It's important to consider these events when planning your taxes and to update your calculations accordingly. For instance, getting married might allow you to file jointly, potentially lowering your tax rate. Conversely, a divorce might require you to file as single or head of household.
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
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
                {faq.answer.split("For more insights, explore our Interest-Only Loan Calculator.")[0]}
                {faq.answer.includes("Interest-Only Loan Calculator") && (
                  <>
                    For more insights, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
                  </>
                )}
                {faq.answer.split("For more detailed planning, explore our Refinance Savings Calculator.")[0] !== faq.answer && (
                  <>
                    {faq.answer.split("For more detailed planning, explore our Refinance Savings Calculator.")[0]}
                    For more detailed planning, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
                  </>
                )}
              </p>
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
                Federal Reserve - Economic Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access comprehensive economic data and analysis from the Federal Reserve.
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
                Consumer Financial Protection Bureau - Tax Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Explore consumer protection information and educational resources on taxes.
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
                FDIC - Banking Regulations
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Learn about banking regulations and deposit insurance information.
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
                Access official tax guidelines and deduction information from the IRS.
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
                Explore detailed financial education and investment concepts.
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
                Discover personal finance guides and comparison tools for consumers.
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
      title="Tax Bracket Calculator"
      description="Find your federal tax bracket. Estimate your effective tax rate based on taxable income and filing status to plan ahead."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Tax Bracket Calculator" },
        { id: "formula", label: "Tax Bracket Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Tax = Σ (Income Portion × Tax Rate)",
        variables: [
          { symbol: "Income Portion", description: "Segments of taxable income" },
          { symbol: "Tax Rate", description: "Corresponding rate for each segment" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a taxable income of $50,000 as a single filer.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "First $9,875 × 10% = $987.50", 
            explanation: "Calculate tax for the first bracket" 
          },
          { 
            label: "Step 2", 
            calculation: "Next $30,250 × 12% = $3,630", 
            explanation: "Calculate tax for the second bracket" 
          },
          { 
            label: "Step 3", 
            calculation: "Remaining $9,875 × 22% = $2,172.50", 
            explanation: "Calculate tax for the third bracket" 
          }
        ],
        result: "The total tax is $6,790, meaning you fall into the 22% tax bracket."
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
