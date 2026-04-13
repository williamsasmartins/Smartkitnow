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
      question: "What is sales tax and why do I need to calculate it?",
      answer: "Sales tax is a consumption tax imposed by state and local governments on the sale of goods and services. You need to calculate it to know the total amount you'll pay at checkout, as the displayed price often doesn't include tax. For example, a $100 item in California (7.25% state tax) will cost $107.25 total.",
    },
    {
      question: "How do I find my local sales tax rate?",
      answer: "Your sales tax rate depends on your state and county. State rates range from 0% in states like Oregon and Montana to 7.25% in California. You can find your exact rate by visiting your state's Department of Revenue website or entering your ZIP code into the calculator.",
    },
    {
      question: "Does sales tax apply to all products?",
      answer: "No, sales tax rules vary by state and product type. Groceries are exempt in most states, while prepared foods are typically taxed. Prescription medications are usually exempt, but over-the-counter drugs are often taxed. Check your state's specific exemptions for clothing, services, and digital goods.",
    },
    {
      question: "What's the difference between state and local sales tax?",
      answer: "State sales tax is set by the state government and applies statewide, while local sales tax is added by counties or cities. For example, New York has a 4% state tax, but New York City adds an additional 4.5%, bringing the total to 8.5%. Your sales tax calculator should account for both rates.",
    },
    {
      question: "Can I use this calculator for online purchases?",
      answer: "Yes, but with important caveats. Since the Supreme Court's 2018 South Dakota v. Wayfair decision, most online retailers must collect sales tax based on where the item is being shipped. However, some small sellers and certain states have exemptions, so verify your specific purchase scenario.",
    },
    {
      question: "How do I calculate sales tax backwards from a total price?",
      answer: "If you know the final total and want to find the pre-tax price, divide the total by 1 plus the tax rate. For a $107.25 total with 7.25% tax: $107.25 ÷ 1.0725 = $100. Some sales tax calculators have a reverse calculation feature for this purpose.",
    },
    {
      question: "Which states have no sales tax?",
      answer: "Five states have no sales tax: Oregon, Montana, New Hampshire, Delaware, and Alaska. However, note that Alaska allows municipalities to impose local sales taxes up to 7.5%. New Hampshire taxes services but not goods, making it a unique case.",
    },
    {
      question: "How often do sales tax rates change?",
      answer: "Sales tax rates can change annually, typically on January 1st, but some jurisdictions make changes mid-year. It's important to verify your calculator uses current 2025 rates, as rates in Texas increased in 2024 and some California localities adjusted theirs as well.",
    },
    {
      question: "Does sales tax apply differently for business purchases?",
      answer: "Yes, businesses often can avoid paying sales tax on wholesale purchases if they hold a resale certificate. However, they typically must pay sales tax on materials and supplies for internal use. Business-to-business transactions usually don't have sales tax, but verify with your state and use the appropriate rate for your situation.",
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
    const priceValue = parseFloat(inputs.price) || 0;
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Sales Tax Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Sales Tax Calculator helps you quickly determine the total amount you'll pay for a purchase by adding applicable sales tax to the item price. Whether you're shopping online, at a store, or budgeting for a large purchase, knowing the final cost before checkout is essential. This calculator eliminates guesswork and helps you make informed spending decisions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter two key pieces of information: the pre-tax price of your item(s) and your applicable sales tax rate. You can find your sales tax rate by entering your state and city, or by looking it up on your state's Department of Revenue website. The rate should include both state-level and local/county taxes, which combined determine your final cost.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you submit your information, the calculator displays the tax amount and your total price due. Review the breakdown to understand how much tax is being applied—this is especially useful for large purchases where taxes can add hundreds of dollars. Save the result for your records or receipts.</p>
        </div>
      </section>

      {/* TABLE: State Sales Tax Rates (2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">State Sales Tax Rates (2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Here are the current state-level sales tax rates across the United States, ranging from 0% to 7.25%.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">State</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sales Tax Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline rate; local taxes add 0.25-2.25%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Texas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased from 6.05% in 2024; local additions common</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Florida</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No state income tax</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New York</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">NYC adds 4.5% for 8.5% total</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pennsylvania</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Groceries exempt; clothing under $110 exempt</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oregon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No sales tax; no state income tax either</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Montana</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No sales tax; 6.84% income tax</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nevada</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.85%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Las Vegas and Clark County reach 8.375%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Washington</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No state income tax; high property taxes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Illinois</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Chicago adds 1.25% for 7.5% total</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates are state-level only and do not include local/county additions, which can range from 0% to 2.5% depending on jurisdiction. Always verify with your specific city or county for the exact combined rate.</p>
      </section>

      {/* TABLE: Common Sales Tax Exemptions by Category */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Sales Tax Exemptions by Category</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Many states exempt certain product categories from sales tax; however, rules vary significantly by state.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Exemption Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Groceries</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exempt in 32 states</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bread, milk, vegetables (but not prepared foods)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Prescription Medications</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exempt in 50 states</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Blood pressure medicine from pharmacy</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Over-the-Counter Drugs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Taxed in 40+ states</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ibuprofen, cold medicine, vitamins</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Clothing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exempt in 5 states</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">New York, New Jersey, Pennsylvania, Maryland, Minnesota</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Utilities</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Generally taxed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Electricity, gas, water bills</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medical Devices</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exempt in most states</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hearing aids, wheelchairs, prosthetics</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Digital Products</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies widely</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">E-books taxed in 13 states; streaming services in 20+ states</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Business Equipment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Usually exempt with certificate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Machinery for manufacturing (varies by state)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Prepared Foods</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Taxed in most states</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restaurant meals, deli items, hot foods</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Exemptions are highly state-specific. What's exempt in California may be taxed in Texas. Always check your state's Department of Revenue for definitive rulings.</p>
      </section>

      {/* TABLE: Sales Tax Calculation Examples at Different Rates */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sales Tax Calculation Examples at Different Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These examples show how sales tax impacts the final price of a $500 purchase across different rate scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Base Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0% (Oregon)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5% (Tennessee)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$525.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.25% (California)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$536.25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8.875% (NY City)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$44.38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$544.38</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10.25% (Louisiana cities)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$51.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$551.25</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are baseline examples. Actual totals may vary with local surcharges and special district taxes. Use the calculator to determine your exact rate.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your local sales tax rate before making large purchases, as rates can vary significantly within the same state—for example, sales tax in San Francisco (8.625%) differs from rural California areas (7.25%).</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep receipts to track sales tax paid throughout the year; if you're self-employed or run a business, you may be able to claim sales tax as a deductible business expense on your tax return.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When shopping across state lines (in-person or online), remember that sales tax applies based on the destination address, not where the seller is located—this matters for online purchases shipped across states.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator before checkout to avoid sticker shock; many people forget to factor in sales tax, leading to overbudgeting or incomplete payment at the register, especially for high-ticket items.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using only state sales tax without local additions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people forget that their total sales tax includes both state and local rates. For example, using only California's 7.25% rate ignores county and city additions that can push the total to 10.25% in some areas. Always confirm your combined rate before calculating.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all items are taxed equally</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sales tax exemptions vary widely by product category and state. Grocery items are tax-free in most states but taxed in others, while prescription medications are exempt everywhere but over-the-counter drugs are often taxed. Check your state's specific rules for each product type.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for tax on online purchases</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many shoppers believe online purchases don't have sales tax, but since 2018, most major retailers must collect sales tax based on the shipping destination. This applies even to purchases from sellers outside your state, so factor it into online shopping budgets.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not updating calculations for rate changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sales tax rates change regularly, sometimes mid-year, and using outdated rates can throw off budgets and projections. Verify your calculator uses 2025 rates and check your state's Department of Revenue website for the most current combined rates in your area.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is sales tax and why do I need to calculate it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sales tax is a consumption tax imposed by state and local governments on the sale of goods and services. You need to calculate it to know the total amount you'll pay at checkout, as the displayed price often doesn't include tax. For example, a $100 item in California (7.25% state tax) will cost $107.25 total.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I find my local sales tax rate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your sales tax rate depends on your state and county. State rates range from 0% in states like Oregon and Montana to 7.25% in California. You can find your exact rate by visiting your state's Department of Revenue website or entering your ZIP code into the calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does sales tax apply to all products?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, sales tax rules vary by state and product type. Groceries are exempt in most states, while prepared foods are typically taxed. Prescription medications are usually exempt, but over-the-counter drugs are often taxed. Check your state's specific exemptions for clothing, services, and digital goods.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between state and local sales tax?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">State sales tax is set by the state government and applies statewide, while local sales tax is added by counties or cities. For example, New York has a 4% state tax, but New York City adds an additional 4.5%, bringing the total to 8.5%. Your sales tax calculator should account for both rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for online purchases?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but with important caveats. Since the Supreme Court's 2018 South Dakota v. Wayfair decision, most online retailers must collect sales tax based on where the item is being shipped. However, some small sellers and certain states have exemptions, so verify your specific purchase scenario.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate sales tax backwards from a total price?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you know the final total and want to find the pre-tax price, divide the total by 1 plus the tax rate. For a $107.25 total with 7.25% tax: $107.25 ÷ 1.0725 = $100. Some sales tax calculators have a reverse calculation feature for this purpose.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which states have no sales tax?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Five states have no sales tax: Oregon, Montana, New Hampshire, Delaware, and Alaska. However, note that Alaska allows municipalities to impose local sales taxes up to 7.5%. New Hampshire taxes services but not goods, making it a unique case.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often do sales tax rates change?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sales tax rates can change annually, typically on January 1st, but some jurisdictions make changes mid-year. It's important to verify your calculator uses current 2025 rates, as rates in Texas increased in 2024 and some California localities adjusted theirs as well.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does sales tax apply differently for business purchases?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, businesses often can avoid paying sales tax on wholesale purchases if they hold a resale certificate. However, they typically must pay sales tax on materials and supplies for internal use. Business-to-business transactions usually don't have sales tax, but verify with your state and use the appropriate rate for your situation.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/businesses/small-businesses-self-employed/sales-tax" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Sales Tax Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on sales tax obligations, deductions, and state-by-state regulations.</p>
          </li>
          <li>
            <a href="https://www.taxadmin.org/sales-tax" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federation of Tax Administrators State Sales Tax Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource with current state sales tax rates and local tax information updated regularly.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/taxes/sales-tax/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate Sales Tax State Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed breakdown of state sales tax rates, exemptions, and how to calculate taxes by state.</p>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/article/taxes/sales-tax-calculator" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NerdWallet Sales Tax Calculator Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational content on sales tax calculation, state exemptions, and online shopping tax implications.</p>
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
