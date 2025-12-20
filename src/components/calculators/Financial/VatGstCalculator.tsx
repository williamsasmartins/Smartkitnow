import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VatGstCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    netAmount: "", 
    taxRate: "", 
    includeTax: true 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is a VAT/GST calculator and why is it important?",
      answer: "A VAT/GST calculator is a tool that helps determine the amount of value-added tax or goods and services tax applicable to a purchase. This is crucial for businesses to set accurate prices and for consumers to understand the total cost of goods or services. By calculating the tax component, users can ensure compliance with tax regulations and avoid financial discrepancies. For businesses, using a VAT/GST calculator can streamline accounting processes and improve financial accuracy. Consumers benefit by gaining transparency into the tax portion of their purchases."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is designed to provide highly accurate results based on the input data. However, its accuracy depends on the correctness of the data entered, such as the net amount and the applicable tax rate. Users should ensure they input the correct figures to achieve precise calculations. In cases of complex transactions, consulting a tax professional is recommended. For best results, double-check your inputs and stay informed about current tax rates. Regular updates to the calculator ensure it remains a reliable tool for financial planning."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need the net amount of the goods or services and the applicable tax rate. The net amount is the price before tax, and the tax rate is the percentage applied to this amount. Ensure you have the correct tax rate for your region or transaction type, as this can vary significantly. Additionally, decide whether the tax is included in the net amount or added on top. This affects the calculation and the final gross amount. Gathering accurate data is crucial for precise results."
    },
    {
      question: "Can I use this calculator for international transactions?",
      answer: "Yes, this calculator can be used for international transactions, provided you have the correct tax rate for the country or region involved. It's essential to be aware of currency exchange rates, as they can affect the final tax amount when converted to your local currency. Ensure you use the most current rates for accurate calculations. For international business operations, maintaining a database of tax rates for different regions can streamline the process. Consider consulting with a tax professional for complex transactions involving multiple jurisdictions."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using incorrect tax rates, not accounting for exemptions or reduced rates, and misunderstanding whether the tax is included in the net amount. These errors can lead to financial discrepancies and compliance issues. It's crucial to verify all inputs and understand the tax regulations applicable to your transaction. To avoid these mistakes, regularly update your knowledge of tax rates and regulations, and use reliable sources for your data."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculation should be done whenever there is a change in the tax rate, the net amount, or if there are regulatory updates. For businesses, recalculating regularly ensures compliance and accurate financial reporting. Consumers should recalculate when making significant purchases or when tax rates change. Establishing a routine for checking tax updates and recalculating as needed can prevent financial errors and ensure accurate budgeting and pricing."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to inform pricing strategies, budget planning, and financial reporting. For businesses, the gross amount can guide pricing decisions, while the tax amount helps in preparing accurate tax filings. Consumers can use the net and gross amounts to understand the true cost of purchases. If the results indicate discrepancies or unexpected values, consider consulting a financial advisor."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives include using accounting software with built-in tax calculation features or consulting with a tax professional for complex transactions. These methods can provide additional insights and ensure compliance with the latest regulations. While this calculator is a convenient tool for quick calculations, more comprehensive solutions may be necessary for businesses with complex financial needs. Evaluate your specific requirements to determine the best approach."
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
    // Parse inputs
    const netAmountValue = parseFloat(inputs.netAmount) || 0;
    const taxRateValue = parseFloat(inputs.taxRate) || 0;

    // Validate
    if (netAmountValue <= 0 || taxRateValue <= 0) {
      return { 
        grossAmount: 0, 
        taxAmount: 0, 
        netAmount: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const taxAmount = netAmountValue * (taxRateValue / 100);
    const grossAmount = inputs.includeTax ? netAmountValue + taxAmount : netAmountValue;
    const netAmount = inputs.includeTax ? netAmountValue : netAmountValue - taxAmount;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      tax: taxAmount / 12,
      gross: grossAmount / 12,
      net: netAmount / 12,
    }));

    return { 
      grossAmount, 
      taxAmount, 
      netAmount, 
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
    setInputs({ netAmount: "", taxRate: "", includeTax: true });
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
              Net Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.netAmount}
              onChange={(e) => setInputs({ ...inputs, netAmount: e.target.value })}
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
              Include Tax in Net Amount
            </Label>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={inputs.includeTax}
                onChange={(e) => setInputs({ ...inputs, includeTax: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-lg text-gray-700 dark:text-gray-300">Yes</span>
            </div>
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
      {results.grossAmount > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Gross Amount
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.grossAmount)}
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
                      Tax Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.taxAmount)}
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
                      Net Amount
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.netAmount)}
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
                    Monthly Breakdown
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
                        <TableHead className="font-semibold">Tax</TableHead>
                        <TableHead className="font-semibold">Gross</TableHead>
                        <TableHead className="font-semibold">Net</TableHead>
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
                            <TableCell>{formatCurrency(row.tax)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.gross)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.net)}
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
          Understanding VAT/GST Calculator
        </h2>
        
        <p className="mb-6">
          The VAT/GST Calculator is an essential tool for businesses and consumers alike, helping to determine the value-added tax (VAT) or goods and services tax (GST) on purchases. Whether you're a business owner looking to price your products correctly or a consumer wanting to understand the tax component of your purchases, this calculator provides clarity. By inputting the net amount and the applicable tax rate, users can quickly ascertain the gross amount, including tax, or the tax amount itself. This is particularly useful for international transactions where tax rates vary significantly.
        </p>
        
        <p className="mb-6">
          Accurate VAT/GST calculations are crucial for financial planning and compliance. Incorrect calculations can lead to financial discrepancies, affecting both profitability and legal compliance. For instance, businesses that under-calculate their tax liabilities may face penalties, while over-calculating can lead to competitive pricing disadvantages. Our calculator ensures precision, helping users avoid such pitfalls. For more on financial planning, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather the necessary information: the net amount of the goods or services and the applicable tax rate. Enter these values into the designated fields, and choose whether the tax is included in the net amount. The calculator will then provide the gross amount, tax amount, and net amount. For detailed financial insights, consider our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the tax rate applicable to your region or transaction type. Tax rates can vary not only by country but also by state or province, and even by the type of goods or services. Ensuring you have the correct rate is crucial for accurate calculations.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include verifying the tax rates from official sources and considering any exemptions or special conditions that might apply. Regularly updating your knowledge on tax regulations can prevent costly errors. For further optimization tips, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          VAT/GST Calculator Formula
        </h2>
        
        <p className="mb-6">
          The VAT/GST Calculator employs a straightforward formula to determine the tax amount and the gross total. The formula is derived from the basic principles of percentage calculation, where the tax rate is applied to the net amount to find the tax amount. This is a standard method used globally, ensuring consistency and reliability in calculations.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Tax Amount = Net Amount × (Tax Rate / 100)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Net Amount = The price of goods/services before tax</li>
              <li>Tax Rate = The applicable VAT/GST percentage</li>
              <li>Gross Amount = Net Amount + Tax Amount</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role. The Net Amount is the base price of the goods or services, excluding any tax. The Tax Rate is the percentage applied to the Net Amount to calculate the Tax Amount. The Gross Amount is the total price, including tax, which is crucial for both sellers and buyers to understand the full cost or revenue. Adjusting any of these variables will directly impact the final calculation, making it essential to input accurate data.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence VAT/GST calculations is crucial for accurate financial planning. These factors can vary widely depending on the region, type of goods or services, and specific tax regulations. Here, we explore the most significant factors that can affect your VAT/GST results.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regional Tax Rates
        </h3>
        <p className="mb-4">
          Tax rates differ significantly from one region to another. For instance, European countries typically have higher VAT rates compared to the United States, where sales tax is more common. It's essential to know the exact rate applicable to your transaction to avoid under or over-calculating the tax.
        </p>
        <p className="mb-6">
          Businesses operating in multiple regions should maintain a database of current tax rates. This ensures that they apply the correct rate for each transaction. For more insights on managing financial complexities, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Type of Goods or Services
        </h3>
        <p className="mb-4">
          Not all goods and services are taxed equally. Some items may be exempt from VAT/GST, while others might be taxed at a reduced rate. For example, essential goods like food and medicine often have lower tax rates or exemptions in many jurisdictions.
        </p>
        <p className="mb-6">
          Understanding these distinctions is vital for accurate pricing and compliance. Businesses should regularly review their product categories to ensure they apply the correct tax rates. For further financial management tools, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Inclusion in Pricing
        </h3>
        <p className="mb-4">
          Whether the tax is included in the net price or added on top affects the calculation. In some regions, prices are displayed inclusive of tax, while in others, tax is added at the point of sale. This distinction impacts how businesses present prices to consumers and calculate their tax liabilities.
        </p>
        <p className="mb-6">
          Businesses should clearly communicate their pricing structure to avoid confusion. Consumers should also be aware of these practices to understand the total cost of their purchases. For more on financial clarity, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Currency Fluctuations
        </h3>
        <p className="mb-6">
          For international transactions, currency fluctuations can affect the final tax amount. Exchange rates can vary daily, impacting the net and gross amounts when converted to the local currency. Businesses dealing with international clients should monitor exchange rates closely to ensure accurate pricing and tax calculations.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regulatory Changes
        </h3>
        <p className="mb-6">
          Tax regulations are subject to change, often influenced by economic policies and government decisions. Staying informed about these changes is crucial for compliance and accurate financial planning. Businesses should regularly consult with tax professionals or subscribe to updates from relevant authorities to stay compliant.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0" />
                {faq.question}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
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
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic research and monetary policy.
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
                Comprehensive consumer protection information and educational resources.
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
                Banking regulations and deposit insurance information.
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
                Official tax guidelines and deduction information.
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
                Detailed financial education and investment concepts explained.
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
                NerdWallet - Personal Finance
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers.
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
      title="VAT/GST Calculator"
      description="Calculate VAT or GST for goods and services. Add or remove tax from the gross amount easily for international pricing."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding VAT/GST Calculator" },
        { id: "formula", label: "VAT/GST Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Tax Amount = Net Amount × (Tax Rate / 100)",
        variables: [
          { symbol: "Net Amount", description: "The price of goods/services before tax" },
          { symbol: "Tax Rate", description: "The applicable VAT/GST percentage" },
          { symbol: "Gross Amount", description: "Net Amount + Tax Amount" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a net amount of $1,000 and a tax rate of 15%",
        steps: [
          { 
            label: "Step 1", 
            calculation: "1000 × 0.15 = 150", 
            explanation: "Calculate the tax amount" 
          },
          { 
            label: "Step 2", 
            calculation: "1000 + 150 = 1150", 
            explanation: "Add the tax amount to the net amount to get the gross amount" 
          }
        ],
        result: "The final gross amount is $1,150, including a $150 tax."
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
