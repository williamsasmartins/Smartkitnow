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
      question: "What is the difference between VAT and GST?",
      answer: "VAT (Value Added Tax) and GST (Goods and Services Tax) are consumption taxes applied at different stages of production and sale, with VAT being the European standard and GST used primarily in countries like Canada, Australia, and New Zealand. Both taxes are typically added to the final price paid by consumers, but VAT is calculated on the value added at each stage, while GST is a single-stage tax. The standard VAT rate in EU countries ranges from 17% to 27%, while Canada's GST is 5% and Australia's GST is 10%.",
    },
    {
      question: "How do I calculate the gross price from a net amount using this calculator?",
      answer: "Enter your net price (the amount before tax) and select the applicable VAT/GST rate for your country or product category. The calculator will automatically multiply the net amount by (1 + tax rate) to determine the gross price. For example, a net price of $100 with a 20% VAT rate results in a gross price of $120.",
    },
    {
      question: "What is the standard VAT rate in the United Kingdom?",
      answer: "The standard VAT rate in the UK is 20%, which applies to most goods and services. However, reduced rates of 5% apply to certain items like domestic fuel, children's car seats, and energy-saving materials, while 0% VAT applies to books, newspapers, food items, and prescription medicines.",
    },
    {
      question: "Can I recover VAT I've paid as a business?",
      answer: "Yes, registered VAT businesses can typically reclaim input VAT (the tax paid on business purchases) against their output VAT (tax collected from customers). However, you can only recover VAT on purchases directly related to your business activities, and certain items like meals and vehicle fuel may have restricted recovery. The process requires maintaining detailed invoices and filing regular VAT returns with your tax authority.",
    },
    {
      question: "How does VAT exemption work in e-commerce?",
      answer: "The VAT treatment of e-commerce varies by location and type of product. For digital services and goods delivered electronically, VAT is typically applied based on the customer's location rather than the seller's location. As of 2024, EU regulations require non-EU sellers to register for VAT if they sell goods to EU consumers, with different rules applying to goods and services worth over €150 in annual revenue.",
    },
    {
      question: "What items are zero-rated for VAT purposes?",
      answer: "Zero-rated (0% VAT) items typically include basic food products, children's clothing, books, newspapers, prescription medicines, and certain medical devices in most VAT jurisdictions. However, zero-rating varies significantly by country; for example, in the UK, restaurant meals are standard-rated at 20%, while takeaway hot food is also 20%, but cold takeaway food is zero-rated.",
    },
    {
      question: "How do VAT thresholds affect small businesses?",
      answer: "Most countries set a VAT registration threshold based on annual turnover; in the UK, this threshold is £85,000 as of 2024. Businesses below this threshold are not required to register for VAT, though they can voluntarily register if desired. Once a business exceeds the threshold, VAT registration becomes mandatory, requiring quarterly returns and accurate record-keeping.",
    },
    {
      question: "What is the reverse charge mechanism in VAT?",
      answer: "The reverse charge mechanism shifts the responsibility of paying VAT from the supplier to the customer in specific B2B transactions, particularly in cross-border business-to-business sales within the EU. This mechanism reduces VAT fraud and administrative burden by allowing the customer to account for both input and output VAT on the same transaction. It applies primarily to intra-community supplies of goods and services above certain thresholds.",
    },
    {
      question: "How do I calculate VAT on international shipments?",
      answer: "When shipping goods internationally, VAT is calculated based on the destination country's rate and rules. For EU shipments under €150, the seller typically charges their home country's VAT unless using the special VAT scheme; above €150, the buyer's country VAT applies. Non-EU sellers must consider import VAT and customs duties, which can range from 5% to 25% depending on the product category and destination country.",
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the VAT/GST Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The VAT/GST Calculator is a financial tool designed to quickly compute the tax amount and total price for goods and services in jurisdictions that use Value Added Tax or Goods and Services Tax. Whether you're a business calculating invoice totals, a consumer understanding the final cost, or an accountant verifying tax compliance, this calculator eliminates manual calculations and reduces errors. Understanding VAT/GST is essential because these consumption taxes significantly impact pricing, profitability, and compliance obligations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you need three key inputs: the net price (the amount before tax), the applicable VAT/GST rate as a percentage, and confirmation of whether you're calculating forward (gross from net) or backward (net from gross). The net price is the base amount excluding any tax, while the rate varies by country and product category—for example, the UK standard rate is 20%, Canada's GST is 5%, and many EU countries have rates between 17% and 27%. You can select your specific country and product type, and the calculator will automatically apply the correct rate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display both the tax amount and the final gross price (or net price if calculating backward). For example, a £100 net price with 20% VAT shows a £20 tax charge and £120 gross total. Business users can also use these calculations for input VAT recovery tracking, pricing strategy analysis, and margin calculations. Remember that some items qualify for reduced or zero rates, which will significantly affect your final calculations.</p>
        </div>
      </section>

      {/* TABLE: Standard VAT Rates by Country (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard VAT Rates by Country (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the current standard VAT rates across major jurisdictions where VAT or GST applies.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Country/Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Reduced Rate(s)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Zero Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United Kingdom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% (food, books, medicines)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Germany</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% (exports, certain services)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">France</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5%, 2.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% (food, medical)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Italy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5%, 4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% (basic foods, medicine)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%, 4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% (food, publications)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Canada</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5% GST</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Included in basic rate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Australia</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10% GST</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% (food, medical)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">New Zealand</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15% GST</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% (exports, services)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">United States</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% Federal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">State: 0-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies by state</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates are subject to change. Some countries have temporary or emergency rate modifications. Check with local tax authorities for the most current information.</p>
      </section>

      {/* TABLE: VAT Calculation Examples (20% Standard Rate) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">VAT Calculation Examples (20% Standard Rate)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how the VAT calculator works with different net prices and the resulting gross totals.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Net Price (£)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">VAT at 20%</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gross Price (£)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">VAT as % of Gross</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">£50.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£10.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£60.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.67%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">£100.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£20.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£120.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.67%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">£250.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£50.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£300.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.67%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">£500.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£100.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£600.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.67%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">£1,000.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£200.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£1,200.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.67%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">£2,500.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£500.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£3,000.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.67%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">£5,000.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£1,000.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">£6,000.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.67%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">VAT as a percentage of gross price remains constant at 16.67% when the standard rate is 20%. This relationship holds across all price points.</p>
      </section>

      {/* TABLE: EU VAT Registration Thresholds and Requirements (2024) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">EU VAT Registration Thresholds and Requirements (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines the VAT registration thresholds and key requirements for businesses operating in EU member states.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Threshold Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Amount (EUR)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Requirement</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Intra-Community Sales Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Threshold</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mandatory registration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Register if annual sales exceed threshold</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Distance Selling (non-EU)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Special scheme applies</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seller liable for customer country VAT</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Distance Selling (EU)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Simplified scheme available</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Customer country VAT rates apply</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low-value imports</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No import VAT on goods below</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Above €150: standard import VAT rules apply</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">B2C e-commerce supplies</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Optional registration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Above threshold: destination country VAT</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Voluntary Registration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">€0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Business can register anytime</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Access to input VAT recovery</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Thresholds are reviewed annually by EU authorities. Some member states have lower national thresholds. Reverse charge rules may apply to B2B supplies regardless of threshold.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify the correct VAT/GST rate for your specific product category and country before calculating, as reduced rates (5-10%) or zero rates apply to items like food, books, and medicines in most jurisdictions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you're a registered business, keep detailed invoices showing VAT amounts separately, as tax authorities require this documentation for input VAT recovery claims and quarterly returns.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For international sales, determine whether you need to apply your home country's VAT, the customer's destination country's VAT, or use the reverse charge mechanism—failure to do so can result in significant compliance issues.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When pricing products, remember that VAT/GST is calculated on the net amount, so a 20% tax on a £100 net price adds exactly £20, not a percentage of the final gross price.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Review your country's VAT threshold annually—in the UK it's £85,000, in the EU it starts at €50,000—because crossing this threshold triggers mandatory registration with additional reporting and compliance obligations.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing VAT with markup percentage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many business owners incorrectly treat a 20% VAT rate the same as a 20% profit margin. VAT is a tax collected on behalf of the government, not revenue for your business—adding 20% VAT to a £100 net cost creates a £120 gross price, but that £20 is owed to tax authorities, not profit.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying VAT to VAT amounts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some users mistakenly calculate tax on the gross price instead of the net price, essentially double-taxing the amount. The correct method is to apply the VAT rate only to the net price; if you have a gross price, you must first remove the tax before calculating new VAT amounts.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring VAT registration obligations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Businesses that exceed VAT thresholds (£85,000 in the UK) but fail to register face penalties, interest charges, and retrospective VAT liability. Many small business owners miss registration deadlines because they don't actively monitor their turnover against the threshold.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Miscalculating tax on zero-rated items</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Zero-rated items like books and children's clothing have 0% VAT, not exemption—this distinction matters because zero-rated suppliers can still recover input VAT, while exempt supplies cannot. Applying standard rates to zero-rated items inflates prices and creates compliance errors.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for reverse charge in B2B transactions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">In eligible B2B cross-border transactions (particularly within the EU), the customer, not the supplier, is responsible for VAT payment through reverse charge. Failing to apply this mechanism results in both parties incorrectly reporting VAT amounts to their tax authorities.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between VAT and GST?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">VAT (Value Added Tax) and GST (Goods and Services Tax) are consumption taxes applied at different stages of production and sale, with VAT being the European standard and GST used primarily in countries like Canada, Australia, and New Zealand. Both taxes are typically added to the final price paid by consumers, but VAT is calculated on the value added at each stage, while GST is a single-stage tax. The standard VAT rate in EU countries ranges from 17% to 27%, while Canada's GST is 5% and Australia's GST is 10%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the gross price from a net amount using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your net price (the amount before tax) and select the applicable VAT/GST rate for your country or product category. The calculator will automatically multiply the net amount by (1 + tax rate) to determine the gross price. For example, a net price of $100 with a 20% VAT rate results in a gross price of $120.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard VAT rate in the United Kingdom?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard VAT rate in the UK is 20%, which applies to most goods and services. However, reduced rates of 5% apply to certain items like domestic fuel, children's car seats, and energy-saving materials, while 0% VAT applies to books, newspapers, food items, and prescription medicines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I recover VAT I've paid as a business?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, registered VAT businesses can typically reclaim input VAT (the tax paid on business purchases) against their output VAT (tax collected from customers). However, you can only recover VAT on purchases directly related to your business activities, and certain items like meals and vehicle fuel may have restricted recovery. The process requires maintaining detailed invoices and filing regular VAT returns with your tax authority.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does VAT exemption work in e-commerce?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The VAT treatment of e-commerce varies by location and type of product. For digital services and goods delivered electronically, VAT is typically applied based on the customer's location rather than the seller's location. As of 2024, EU regulations require non-EU sellers to register for VAT if they sell goods to EU consumers, with different rules applying to goods and services worth over €150 in annual revenue.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What items are zero-rated for VAT purposes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Zero-rated (0% VAT) items typically include basic food products, children's clothing, books, newspapers, prescription medicines, and certain medical devices in most VAT jurisdictions. However, zero-rating varies significantly by country; for example, in the UK, restaurant meals are standard-rated at 20%, while takeaway hot food is also 20%, but cold takeaway food is zero-rated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do VAT thresholds affect small businesses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most countries set a VAT registration threshold based on annual turnover; in the UK, this threshold is £85,000 as of 2024. Businesses below this threshold are not required to register for VAT, though they can voluntarily register if desired. Once a business exceeds the threshold, VAT registration becomes mandatory, requiring quarterly returns and accurate record-keeping.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the reverse charge mechanism in VAT?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The reverse charge mechanism shifts the responsibility of paying VAT from the supplier to the customer in specific B2B transactions, particularly in cross-border business-to-business sales within the EU. This mechanism reduces VAT fraud and administrative burden by allowing the customer to account for both input and output VAT on the same transaction. It applies primarily to intra-community supplies of goods and services above certain thresholds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate VAT on international shipments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">When shipping goods internationally, VAT is calculated based on the destination country's rate and rules. For EU shipments under €150, the seller typically charges their home country's VAT unless using the special VAT scheme; above €150, the buyer's country VAT applies. Non-EU sellers must consider import VAT and customs duties, which can range from 5% to 25% depending on the product category and destination country.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.gov.uk/topic/business-tax/vat" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">HM Revenue & Customs: VAT Guidance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official UK government resource providing comprehensive VAT rates, registration requirements, and compliance information.</p>
          </li>
          <li>
            <a href="https://ec.europa.eu/taxation_customs/business/vat/vat-rates_en" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">European Commission: VAT Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative source for current VAT rates across all EU member states and guidance on EU VAT rules.</p>
          </li>
          <li>
            <a href="https://www.canada.ca/taxes/businesses/topics/gst-hst.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Canada Revenue Agency: GST/HST Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Canadian tax authority providing GST and HST rates, registration thresholds, and business compliance requirements.</p>
          </li>
          <li>
            <a href="https://www.ato.gov.au/Business/Goods-and-Services-Tax-GST/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Australian Taxation Office: GST</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Primary resource for Australian GST rates, registration obligations, and input tax credit information for businesses.</p>
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
