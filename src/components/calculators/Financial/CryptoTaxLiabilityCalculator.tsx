import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CryptoTaxLiabilityCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    cryptoGains: "", 
    taxRate: "", 
    otherIncome: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is crypto tax liability calculator and why is it important?",
      answer: "The crypto tax liability calculator is a tool designed to estimate your potential tax obligations from cryptocurrency transactions. It's important because it helps you understand your financial responsibilities and prepare for tax season. By using this calculator, you can avoid unexpected liabilities and ensure compliance with tax regulations. Understanding your tax liability is crucial for effective financial planning. It allows you to set aside funds for taxes and avoid penalties. For more tools, visit our Refinance Savings Calculator."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides estimates based on the information you input. While it uses standard formulas, the accuracy depends on the accuracy of your data. Factors such as market volatility and tax law changes can affect the results. It's always advisable to consult with a tax professional for precise calculations. To improve accuracy, ensure your inputs are current and reflect your actual financial situation. Regularly update your calculations to account for any changes."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you'll need to provide your total crypto gains, the applicable tax rate, and any additional income. Crypto gains refer to the profit from your cryptocurrency transactions. The tax rate is the percentage of tax that applies to your income bracket. Other income includes any additional earnings subject to taxation. Ensure you have accurate records of your transactions and consult with a tax advisor if you're unsure about your tax rate. Keeping detailed records will help you input the correct data and achieve accurate results."
    },
    {
      question: "Can I use this calculator for [specific scenario]?",
      answer: "Yes, this calculator can be used for various scenarios involving cryptocurrency transactions. Whether you're calculating taxes for a single transaction or multiple trades, the calculator can provide estimates. However, it's important to note that complex scenarios, such as those involving international transactions or multiple currencies, may require additional considerations. For complex situations, consulting with a tax professional is recommended. They can provide tailored advice and ensure compliance with all applicable regulations."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include inputting incorrect data, such as outdated crypto gains or tax rates. Failing to account for all transactions can also lead to inaccurate results. Additionally, not considering changes in tax laws or market conditions can affect your calculations. To avoid these errors, double-check your inputs and stay informed about any changes in tax regulations. Regularly update your calculations and consult with a tax advisor if needed."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's advisable to recalculate your tax liability regularly, especially if you frequently trade cryptocurrencies. Market conditions and tax laws can change, affecting your liability. Recalculating quarterly or after significant transactions can help you stay on top of your financial obligations. Having a regular schedule for recalculations ensures that you're prepared for tax season and can make informed financial decisions throughout the year."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to plan for your tax payments and set aside the necessary funds. Understanding your tax liability helps you avoid surprises during tax season and ensures compliance with tax regulations. If your liability is significant, consider consulting with a tax advisor for personalized advice. For more financial planning tools, explore our HELOC Payment Estimator."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Yes, there are alternative methods for calculating crypto tax liability, such as using specialized tax software or consulting with a tax professional. These alternatives can provide more detailed insights and accommodate complex scenarios. While this calculator offers a convenient estimation, exploring other methods can enhance accuracy and provide a comprehensive view of your tax obligations."
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
    let cryptoGainsValue = parseFloat(inputs.cryptoGains) || 0;
    const taxRateValue = parseFloat(inputs.taxRate) || 0;
    const otherIncomeValue = parseFloat(inputs.otherIncome) || 0;

    // Validate
    if (cryptoGainsValue < 0 || taxRateValue <= 0) {
      return { 
        mainResult: 0, 
        totalTaxLiability: 0, 
        netIncome: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const mainResult = cryptoGainsValue * (taxRateValue / 100);
    const totalTaxLiability = mainResult + (otherIncomeValue * (taxRateValue / 100));
    const netIncome = cryptoGainsValue + otherIncomeValue - totalTaxLiability;

    // Generate schedule data if applicable (e.g., tax payment schedule)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      estimatedPayment: totalTaxLiability / 12,
      remainingLiability: totalTaxLiability - ((totalTaxLiability / 12) * (i + 1))
    }));

    return { 
      mainResult, 
      totalTaxLiability, 
      netIncome, 
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
    setInputs({ cryptoGains: "", taxRate: "", otherIncome: "" });
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
              Crypto Gains
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.cryptoGains}
              onChange={(e) => setInputs({ ...inputs, cryptoGains: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Tax Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15"
              value={inputs.taxRate}
              onChange={(e) => setInputs({ ...inputs, taxRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Other Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={inputs.otherIncome}
              onChange={(e) => setInputs({ ...inputs, otherIncome: e.target.value })}
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
                      Estimated Tax Liability
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
                      Total Tax Liability
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalTaxLiability)}
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
                      Net Income After Tax
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.netIncome)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* TAX PAYMENT SCHEDULE TABLE */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Tax Payment Schedule
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
                        <TableHead className="font-semibold">Estimated Payment</TableHead>
                        <TableHead className="font-semibold">Remaining Liability</TableHead>
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
                            <TableCell>{formatCurrency(row.estimatedPayment)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.remainingLiability)}
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
          Understanding Crypto Tax Liability Calculator
        </h2>
        
        <p className="mb-6">
          The Crypto Tax Liability Calculator is an essential tool for anyone involved in cryptocurrency trading or investing. As the popularity of digital currencies continues to rise, so does the complexity of tax regulations surrounding them. This calculator helps you estimate your potential tax liability based on your crypto gains, tax rate, and other income sources. By understanding your tax obligations, you can better prepare for tax season and avoid unexpected liabilities. Whether you're a seasoned trader or a casual investor, this tool provides clarity and peace of mind.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the realm of cryptocurrency taxation. With fluctuating market values and varying tax rates, even small errors can lead to significant financial consequences. According to recent studies, a large percentage of crypto investors are unaware of their full tax obligations, leading to potential fines and penalties. This calculator simplifies the process, allowing you to make informed decisions and optimize your tax strategy. For more insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather all relevant financial information beforehand. You'll need to input your total crypto gains, applicable tax rate, and any additional income. The calculator will then compute your estimated tax liability and net income after taxes. For accurate results, ensure that your data is up-to-date and reflects your current financial situation. For additional guidance, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. Small discrepancies in your crypto gains or tax rate can lead to significant differences in your tax liability. Use this tool regularly to stay updated with your financial status and make necessary adjustments to your tax strategy.
          </p>
        </div>
        
        <p className="mb-6">
          For optimal results, consider the timing of your calculations. Cryptocurrency markets are volatile, and prices can change rapidly. It's advisable to perform calculations at regular intervals and adjust your strategy accordingly. Additionally, be aware of any changes in tax laws that may affect your liability. By staying informed and proactive, you can minimize your tax burden and maximize your net income.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Crypto Tax Liability Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is designed to provide a straightforward estimation of your crypto tax liability. It takes into account your total crypto gains, the applicable tax rate, and any additional income you may have. This approach is widely accepted in the financial industry and aligns with standard tax calculation practices. By using this formula, you can gain a clear understanding of your potential tax obligations and plan accordingly.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Tax Liability = (Crypto Gains × Tax Rate) + (Other Income × Tax Rate)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Crypto Gains = Total profit from cryptocurrency transactions</li>
              <li>Tax Rate = Percentage of tax applicable on your income</li>
              <li>Other Income = Additional income subject to the same tax rate</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining your tax liability. The Crypto Gains represent the total profit you've made from buying and selling cryptocurrencies. The Tax Rate is the percentage of tax that applies to your income bracket. Other Income includes any additional earnings that are subject to taxation. By adjusting these variables, you can see how different scenarios impact your overall tax obligation. For instance, a higher tax rate will increase your liability, while additional income will also contribute to a larger tax bill.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your crypto tax liability is essential for accurate calculations. These factors can vary significantly based on your financial situation and the specific details of your cryptocurrency transactions. By recognizing how these elements interact, you can optimize your tax strategy and minimize your liability.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Market Volatility
        </h3>
        <p className="mb-4">
          Cryptocurrency markets are known for their volatility, which can significantly impact your gains and losses. Price fluctuations can lead to unexpected profits or losses, affecting your overall tax liability. It's crucial to monitor market trends and adjust your calculations accordingly to ensure accuracy.
        </p>
        <p className="mb-6">
          To mitigate the effects of market volatility, consider using dollar-cost averaging or other investment strategies. These approaches can help stabilize your returns and reduce the impact of short-term market swings. For more strategies, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Regulations
        </h3>
        <p className="mb-4">
          Tax laws and regulations surrounding cryptocurrencies are continually evolving. Changes in legislation can affect how your gains are taxed and what deductions you may be eligible for. Staying informed about these changes is vital for accurate tax planning.
        </p>
        <p className="mb-6">
          Regularly consult with a tax professional or financial advisor to stay updated on the latest regulations. They can provide valuable insights and help you navigate complex tax scenarios. Understanding these regulations can prevent costly mistakes and ensure compliance with the law.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Duration
        </h3>
        <p className="mb-4">
          The length of time you hold your cryptocurrency investments can influence your tax liability. Long-term holdings may qualify for lower tax rates, while short-term trades are typically taxed at higher rates. Understanding these distinctions can help you optimize your investment strategy.
        </p>
        <p className="mb-6">
          Consider holding investments for longer periods to take advantage of favorable tax rates. However, always weigh the potential tax benefits against market conditions and your financial goals. For more insights, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Income Bracket
        </h3>
        <p className="mb-6">
          Your overall income level determines the tax bracket you fall into, which directly affects your tax rate. Higher income levels may result in higher tax rates, increasing your liability. It's essential to consider your entire financial picture when calculating your crypto taxes.
        </p>
        <p className="mb-6">
          To manage your tax bracket effectively, explore opportunities for deductions and credits. These can reduce your taxable income and lower your overall tax burden. Consult with a tax advisor to identify potential savings and optimize your tax strategy.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Transaction History
        </h3>
        <p className="mb-6">
          Keeping detailed records of your cryptocurrency transactions is crucial for accurate tax calculations. Each trade, purchase, or sale can impact your gains and losses, affecting your tax liability. Ensure that your records are comprehensive and up-to-date.
        </p>
        <p className="mb-6">
          Use reliable software or tools to track your transaction history and generate reports. These resources can simplify the process and help you identify any discrepancies. Accurate record-keeping is essential for compliance and can prevent issues during tax audits.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq" className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-10">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0" />
                {faq.question}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                {faq.answer}
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
                Federal Reserve - Cryptocurrency Regulations
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on cryptocurrency regulations and their impact on financial markets.
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
                Consumer Financial Protection Bureau - Crypto Guide
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on cryptocurrencies.
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
                FDIC - Digital Asset Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information related to digital assets.
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
                Internal Revenue Service - Cryptocurrency Tax Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information for cryptocurrency transactions.
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
                Investopedia - Cryptocurrency Investment
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts related to cryptocurrencies.
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
                NerdWallet - Cryptocurrency Tax Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for cryptocurrency tax planning.
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
      title="Crypto Tax Liability Calculator"
      description="Estimate your potential crypto tax liability. Prepare for tax season by calculating estimated gains and losses."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Crypto Tax Liability Calculator" },
        { id: "formula", label: "Crypto Tax Liability Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Tax Liability = (Crypto Gains × Tax Rate) + (Other Income × Tax Rate)",
        variables: [
          { symbol: "Crypto Gains", description: "Total profit from cryptocurrency transactions" },
          { symbol: "Tax Rate", description: "Percentage of tax applicable on your income" },
          { symbol: "Other Income", description: "Additional income subject to the same tax rate" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have $10,000 in crypto gains, a tax rate of 15%, and $5,000 in other income.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "10000 × 0.15 = 1500", 
            explanation: "Calculate the tax on crypto gains." 
          },
          { 
            label: "Step 2", 
            calculation: "5000 × 0.15 = 750", 
            explanation: "Calculate the tax on other income." 
          },
          { 
            label: "Step 3", 
            calculation: "1500 + 750 = 2250", 
            explanation: "Total tax liability is $2,250." 
          }
        ],
        result: "The final result is $2,250, meaning this is your estimated tax liability."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📊"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💳"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💰"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}
