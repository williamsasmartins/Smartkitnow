import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function SalesTaxCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    price: "", 
    taxRate: "", 
    quantity: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is a sales tax calculator and why is it important?",
      answer: "A sales tax calculator is a tool that helps you determine the total cost of a purchase, including the sales tax. It is important because it allows consumers and businesses to accurately budget for purchases and ensure compliance with tax regulations. By knowing the total cost upfront, you can make informed financial decisions and avoid unexpected expenses. For businesses, using a sales tax calculator ensures that you are charging the correct amount of tax to your customers, which is crucial for maintaining compliance with tax laws. For more financial tools, check out our <a href=\"/financial/interest-only-loan\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Interest-Only Loan Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is highly accurate as long as the correct inputs are provided. The accuracy depends on the precision of the price, tax rate, and quantity entered. However, it's important to note that tax rates can change, and there may be exemptions or special rates that apply to certain items. Always verify the current tax rate for your location to ensure accuracy. For best results, double-check your inputs and consult with a tax professional if you have any doubts or complex scenarios. This will help you avoid errors and ensure compliance with tax regulations."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you'll need the following information: the price of the item, the applicable sales tax rate, and the quantity of items being purchased. The price should be the cost of a single item before tax. The tax rate is the percentage of the price that is added as tax, which varies by location. The quantity is the number of items being purchased. You can typically find the tax rate on local government websites or by contacting your local tax authority. Ensure that the information you gather is up-to-date and specific to your location for the most accurate results."
    },
    {
      question: "Can I use this calculator for online purchases?",
      answer: "Yes, this calculator can be used for online purchases. However, it's important to note that the sales tax rate may vary depending on the seller's location and the buyer's location. Some online retailers may not charge sales tax if they do not have a nexus in the buyer's state. Always check the tax rate applicable to your purchase location to ensure accurate calculations. If you're unsure about the tax rate for an online purchase, contact the retailer or consult their website for more information. This will help you avoid surprises when it comes to the total cost of your purchase."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "One common mistake is using an outdated or incorrect tax rate, which can lead to inaccurate calculations. Another mistake is not accounting for exemptions or special rates that may apply to certain items. Additionally, failing to include all applicable fees and charges in the total price can result in an incorrect calculation. To avoid these errors, always verify the current tax rate for your location and ensure that you're including all relevant costs in your calculation. This will help you achieve the most accurate results possible."
    },
    {
      question: "How often should I recalculate?",
      answer: "You should recalculate whenever there is a change in the tax rate, the price of the item, or the quantity being purchased. Additionally, if there are changes in tax legislation or exemptions that apply to your purchase, it's important to update your calculation to reflect these changes. Regularly reviewing and updating your calculations ensures that you are always working with the most accurate and up-to-date information, which is crucial for effective financial planning."
    },
    {
      question: "What should I do with these results?",
      answer: "Once you have your results, use them to inform your budgeting and financial planning. The total amount, including tax, gives you a clear picture of the cost of your purchase, allowing you to allocate funds accordingly. If the results indicate a higher cost than expected, consider adjusting your purchase plans or exploring alternatives. If you're a business owner, use the results to ensure that you're charging the correct amount of tax to your customers. For more financial planning tools, explore our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "While this calculator provides a quick and accurate way to calculate sales tax, there are alternative methods. Some people prefer to use spreadsheet software to create custom formulas that account for specific variables or scenarios. Others may use financial software that integrates sales tax calculations with other financial planning tools. Each method has its pros and cons, and the best choice depends on your specific needs and preferences. For comprehensive financial planning, consider using a combination of tools to achieve the most accurate and effective results."
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
    let priceValue = parseFloat(inputs.price) || 0;
    const taxRateValue = parseFloat(inputs.taxRate) || 0;
    const quantityValue = parseInt(inputs.quantity) || 1;

    // Validate
    if (priceValue <= 0 || taxRateValue < 0) {
      return { 
        totalTax: 0, 
        totalPrice: 0, 
        totalAmount: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalTax = priceValue * (taxRateValue / 100) * quantityValue;
    const totalPrice = priceValue * quantityValue;
    const totalAmount = totalPrice + totalTax;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      payment: totalAmount / 12,
      principal: (totalAmount / 12) * 0.8,
      interest: (totalAmount / 12) * 0.2,
      balance: totalAmount - ((totalAmount / 12) * (i + 1))
    }));

    return { 
      totalTax, 
      totalPrice, 
      totalAmount, 
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
    setInputs({ price: "", taxRate: "", quantity: "" });
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
              Price per Item
            </Label>
            <Input
              type="number"
              placeholder="e.g., 100"
              value={inputs.price}
              onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
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
              placeholder="e.g., 7.5"
              value={inputs.taxRate}
              onChange={(e) => setInputs({ ...inputs, taxRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Quantity
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1"
              value={inputs.quantity}
              onChange={(e) => setInputs({ ...inputs, quantity: e.target.value })}
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
      {results.totalAmount > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Amount
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.totalAmount)}
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
                      Total Tax
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalTax)}
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
                      Total Price (Excluding Tax)
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalPrice)}
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
          Understanding Sales Tax Calculator
        </h2>
        
        <p className="mb-6">
          Sales tax is a crucial component of any purchase, impacting both consumers and businesses. This Sales Tax Calculator is designed to help you quickly and accurately determine the total cost of your purchases, including sales tax. Whether you're a consumer trying to budget for a large purchase or a business owner needing to calculate the tax on sales, this tool provides a straightforward way to ensure you're accounting for all necessary costs. By entering the price of the item, the applicable tax rate, and the quantity, you can instantly see the total tax amount, the price before tax, and the final amount due.
        </p>
        
        <p className="mb-6">
          The importance of accurate sales tax calculations cannot be overstated. Incorrect calculations can lead to financial discrepancies, affecting your budgeting and financial planning. For businesses, this could mean undercharging or overcharging customers, which can impact customer satisfaction and compliance with tax regulations. For consumers, understanding the total cost of a purchase helps in making informed financial decisions. Our calculator is designed to eliminate these errors by providing precise calculations based on the inputs you provide. For more detailed financial planning, consider using our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          Using the Sales Tax Calculator is simple. Start by gathering the necessary information: the price of the item, the sales tax rate, and the quantity of items. Enter these values into the calculator, and it will compute the total tax and the final purchase price. This tool is particularly useful for comparing prices between different jurisdictions with varying tax rates. For example, if you're shopping online and want to compare the total cost from different vendors, this calculator can quickly show you the impact of different tax rates. For more insights, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the tax rate applicable to your purchase location. Tax rates can vary significantly between states, counties, and cities. Using the correct rate ensures that your calculations are accurate and compliant with local tax laws.
          </p>
        </div>
        
        <p className="mb-6">
          To optimize your use of the Sales Tax Calculator, consider the following tips: Ensure that the tax rate you enter is up-to-date and specific to your location. If you're purchasing multiple items, enter the total price for all items to get an accurate calculation. Remember that some items may be exempt from sales tax, depending on local laws. By keeping these factors in mind, you can make the most of this tool and avoid common pitfalls.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Sales Tax Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this Sales Tax Calculator is straightforward yet effective for determining the total cost of a purchase, including sales tax. The primary formula is: 
          <strong> Total Tax = Price × (Tax Rate / 100) × Quantity</strong>. This formula calculates the total tax amount based on the price of the item, the applicable sales tax rate, and the quantity of items purchased. The total amount payable is then calculated by adding the total tax to the price of the items.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Amount = (Price × Quantity) + (Price × (Tax Rate / 100) × Quantity)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Price = Cost of a single item</li>
              <li>Tax Rate = Applicable sales tax percentage</li>
              <li>Quantity = Number of items purchased</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role. The "Price" is the base cost of the item before tax. The "Tax Rate" is the percentage of the price that is added as tax, which varies by location. The "Quantity" is the number of items being purchased, which affects the total cost proportionally. For example, if you're buying multiple units of the same item, the total tax and total price will increase accordingly. Understanding how each of these variables impacts the final calculation is essential for accurate budgeting and financial planning.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your sales tax calculations is crucial for accurate financial planning. These factors can vary widely depending on your location, the type of items you're purchasing, and the current tax laws. By considering these elements, you can ensure that your calculations are as precise as possible.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Location-Based Tax Rates
        </h3>
        <p className="mb-4">
          One of the most significant factors affecting sales tax calculations is the location-based tax rate. Different states, counties, and cities can have varying tax rates, which can significantly impact the total cost of a purchase. For instance, a purchase in New York City may have a different tax rate compared to a purchase in Los Angeles. It's essential to use the correct tax rate for your location to ensure accurate calculations.
        </p>
        <p className="mb-6">
          To optimize your calculations, always verify the current tax rate for your specific location. This information is typically available on local government websites or through financial resources. For more detailed calculations, you might also consider using our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Exemptions and Special Rates
        </h3>
        <p className="mb-4">
          Certain items may be exempt from sales tax or subject to special rates. For example, groceries and prescription medications are often exempt from sales tax in many states. Additionally, some states offer tax holidays where specific items can be purchased tax-free. Understanding these exemptions and special rates can help you save money and ensure compliance with tax laws.
        </p>
        <p className="mb-6">
          When planning a purchase, check if any exemptions apply to the items you're buying. This can be particularly beneficial during tax holidays or when purchasing items that are typically exempt. For more information on how these factors can affect your financial planning, consider using our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Changes in Tax Legislation
        </h3>
        <p className="mb-4">
          Tax laws and rates can change over time, impacting how sales tax is calculated. These changes can occur at the federal, state, or local level and may affect the tax rate or the items subject to tax. Staying informed about these changes is essential for accurate financial planning and compliance.
        </p>
        <p className="mb-6">
          To stay updated on tax legislation, consider subscribing to updates from local government websites or financial news outlets. Understanding these changes can help you adjust your financial strategies accordingly. For more insights, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Bulk Purchases and Discounts
        </h3>
        <p className="mb-6">
          When purchasing items in bulk or with discounts, the sales tax calculation can become more complex. Bulk purchases may qualify for discounts, which can reduce the taxable amount. Similarly, promotional discounts can affect the final price and, consequently, the sales tax. It's important to account for these factors when calculating the total cost of a purchase.
        </p>
        <p className="mb-6">
          To accurately calculate sales tax on discounted or bulk purchases, ensure that you apply the discount before calculating the tax. This will provide a more accurate reflection of the total cost. For more detailed financial planning, consider using our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Online vs. In-Store Purchases
        </h3>
        <p className="mb-6">
          The rise of online shopping has introduced new complexities in sales tax calculations. Depending on the seller's location and the buyer's location, different tax rates may apply. Some online retailers may not charge sales tax at all, depending on their nexus with the buyer's state. Understanding these nuances is crucial for accurate budgeting and financial planning.
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
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic conditions and monetary policy
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
                Comprehensive consumer protection information and educational resources
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
                Banking regulations and deposit insurance information
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
                Internal Revenue Service - Sales Tax Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information
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
                Investopedia - Sales Tax Explained
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained
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
                Personal finance guides and comparison tools for consumers
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
      title="Sales Tax Calculator"
      description="Calculate sales tax and total purchase price. Add local tax rates to net prices instantly for accurate budgeting."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Sales Tax Calculator" },
        { id: "formula", label: "Sales Tax Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Amount = (Price × Quantity) + (Price × (Tax Rate / 100) × Quantity)",
        variables: [
          { symbol: "Price", description: "Cost of a single item" },
          { symbol: "Tax Rate", description: "Applicable sales tax percentage" },
          { symbol: "Quantity", description: "Number of items purchased" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a purchase of 5 items each costing $100 with a tax rate of 7.5%",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100 × 5 = 500", 
            explanation: "Calculate the total price before tax" 
          },
          { 
            label: "Step 2", 
            calculation: "500 × 0.075 = 37.5", 
            explanation: "Calculate the total tax amount" 
          },
          { 
            label: "Step 3", 
            calculation: "500 + 37.5 = 537.5", 
            explanation: "Final result shows the total amount payable" 
          }
        ],
        result: "The final result is $537.50, meaning the total cost including tax for 5 items is $537.50"
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💳" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "🏦" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏡" }
      ]}
    />
  );
}
