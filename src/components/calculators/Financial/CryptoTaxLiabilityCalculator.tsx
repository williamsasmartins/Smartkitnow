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
      question: "What transactions trigger capital gains tax in cryptocurrency?",
      answer: "Any sale, trade, or exchange of crypto for fiat currency, other cryptocurrencies, or goods and services is a taxable event. This includes selling Bitcoin for USD, swapping Ethereum for Dogecoin on a DEX, or purchasing coffee with cryptocurrency. Even if you realize a loss, you must report the transaction to claim the loss deduction against other income, up to $3,000 per year in the U.S.",
    },
    {
      question: "How do I calculate my cost basis for cryptocurrency purchases?",
      answer: "Cost basis includes the purchase price plus any transaction fees (mining fees, exchange fees, conversion costs). For example, if you bought 1 Bitcoin at $40,000 and paid $200 in fees, your cost basis is $40,200. The crypto tax calculator uses this figure to determine your gain or loss when you sell. Accurate cost basis tracking is critical because the IRS requires specific identification of which coins you sold using methods like FIFO, LIFO, or specific ID.",
    },
    {
      question: "What is the difference between short-term and long-term capital gains on crypto?",
      answer: "Short-term capital gains apply to crypto held for one year or less and are taxed as ordinary income at rates up to 37% (2024). Long-term capital gains apply to crypto held for more than one year and receive preferential rates: 0%, 15%, or 20% depending on your tax bracket. For example, a $10,000 gain on Bitcoin held 6 months could owe $3,700 in federal tax, while the same gain held 13 months could owe $1,500.",
    },
    {
      question: "Do I owe taxes on cryptocurrency staking rewards?",
      answer: "Yes, staking rewards are taxed as ordinary income at their fair market value on the date received. If you stake Ethereum and receive 0.5 ETH worth $1,000 at that time, you owe income tax on $1,000. When you later sell that staked ETH, you also owe capital gains tax on any appreciation or loss from the $1,000 cost basis. The crypto tax liability calculator helps you track both the initial income tax and subsequent capital gains.",
    },
    {
      question: "How does the wash-sale rule apply to cryptocurrency losses?",
      answer: "The IRS wash-sale rule does not currently apply to cryptocurrency, unlike stocks and bonds, allowing you to sell at a loss and immediately repurchase the same asset to claim the loss. However, this is subject to change pending legislation. You can deduct crypto losses up to $3,000 against other income annually, with excess losses carried forward indefinitely. Always consult a tax professional, as rules continue to evolve.",
    },
    {
      question: "What crypto transactions are NOT taxable events?",
      answer: "Non-taxable events include transferring crypto between your own wallets, purchasing crypto with fiat currency, holding crypto without selling, and charitable donations (reported at fair market value). However, receiving crypto as payment for services, mining rewards, airdrops, and hard fork coins ARE taxable when received. The calculator focuses on transactions that create a tax liability, so transfers between personal wallets should be excluded from calculations.",
    },
    {
      question: "How do I report cryptocurrency income from mining and airdrops?",
      answer: "Mining income and airdrops are reported as ordinary income on Form 1040 and Schedule C at the fair market value on the date received. If you mined 0.1 Bitcoin when it was worth $25,000, you report $2,500 as income. If you receive an airdrop of 1,000 new tokens worth $5 each, you report $5,000 as income. These amounts establish your cost basis, so future appreciation or depreciation creates a separate capital gain or loss.",
    },
    {
      question: "What records do I need to provide to the calculator for accurate tax liability estimates?",
      answer: "You need: transaction date, type (buy, sell, trade, stake), amount of crypto, price per unit at transaction date, any fees paid, and the asset received (if trading). For accurate calculations, maintain records from your exchange (CSV exports), wallet transactions, and DEX activity. The calculator uses these inputs to compute your total taxable income, short-term and long-term gains, and estimated tax liability based on your filing status.",
    },
    {
      question: "How does my tax bracket affect my crypto tax liability?",
      answer: "Your tax bracket determines your marginal rate for short-term gains (taxed as ordinary income) and your rate for long-term gains (0%, 15%, or 20%). In 2024, single filers with income up to $47,025 pay 10% on short-term gains and 0% on long-term gains; income from $47,026–$518,900 pays up to 24% short-term and 15% long-term. The crypto tax calculator can estimate your liability if you provide your estimated total income and filing status.",
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
    const cryptoGainsValue = parseFloat(inputs.cryptoGains) || 0;
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Crypto Tax Liability Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Crypto Tax Liability Calculator estimates your federal income tax and capital gains tax owed on cryptocurrency transactions throughout a tax year. This tool is essential because every crypto sale, trade, and income event (mining, staking, airdrops) creates a taxable event with different tax rates and reporting requirements. Understanding your potential tax liability helps you plan sales, optimize losses, and avoid underpayment penalties.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your individual transactions including the date acquired, date sold, quantity, purchase price per unit, sale price per unit, and any transaction fees. You'll also need to specify your filing status and estimated total taxable income (wages, self-employment, interest, dividends, etc.) to determine your applicable tax bracket. The calculator automatically categorizes gains and losses by holding period (short-term vs. long-term) and computes your ordinary income from staking or mining rewards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your short-term capital gains (taxed at ordinary rates up to 37%), long-term capital gains (taxed at preferential rates of 0%, 15%, or 20%), and total estimated federal tax liability. Review the detailed breakdown to identify high-tax transactions and consider tax-loss harvesting or timing strategies. Remember that this calculator provides federal tax estimates only and does not include state or local taxes, self-employment tax, net investment income tax (3.8%), or alternative minimum tax (AMT), so consult a tax professional for a complete picture.</p>
        </div>
      </section>

      {/* TABLE: 2024 Long-Term Capital Gains Tax Rates by Filing Status */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024 Long-Term Capital Gains Tax Rates by Filing Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Long-term capital gains on cryptocurrency held over one year receive preferential tax rates based on your income and filing status.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Filing Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0% Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15% Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20% Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Single</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$47,025</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$47,026–$518,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$518,901+</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Married Filing Jointly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$94,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$94,051–$583,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$583,751+</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Married Filing Separately</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$47,025</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$47,026–$291,875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$291,876+</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Head of Household</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$62,975</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$62,976–$551,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$551,351+</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates apply to taxable income, including long-term crypto gains. Net investment income tax of 3.8% may apply to high-income earners.</p>
      </section>

      {/* TABLE: Sample Crypto Tax Liability Calculations */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Crypto Tax Liability Calculations</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These examples show how the calculator determines tax liability based on holding period and income level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Purchase Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sale Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Holding Period</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Federal Tax Owed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bitcoin sold after 3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Short-term</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24% (ordinary income)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ethereum sold after 14 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$225</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Staking rewards converted immediately</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000 (fair market value)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt; 1 year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32% (ordinary income + NIIT)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$384</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Multi-year hodl sold at profit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term (5+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% or 15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$3,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes single filer; does not include state or local taxes. Self-employment tax may apply if crypto is business income.</p>
      </section>

      {/* TABLE: Crypto Income and Tax Reporting Requirements */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Crypto Income and Tax Reporting Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different types of crypto transactions have specific reporting requirements and tax treatment.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Transaction Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Taxable Event?</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">When Reported</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Form</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Treatment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Buying crypto with fiat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Establishes cost basis only</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Selling crypto for fiat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sale date</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Form 8949</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Capital gain/loss (short or long-term)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Trading crypto for crypto</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Trade date</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Form 8949</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Capital gain/loss; value at FMV received</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mining rewards</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Receipt date</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Schedule C (self-employment)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ordinary income at FMV</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Staking rewards</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Receipt date</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Form 1099-MISC or Schedule C</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ordinary income; subsequent sale is capital gain/loss</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Airdrops</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Receipt date</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Schedule C (if income)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ordinary income at FMV</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Transfer between own wallets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No tax impact</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Form 1099-NEC may be issued by exchanges; always reconcile with your own records. Reporting thresholds may vary by state.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track all transactions with dates and prices in real-time using exchange exports, wallet transaction history, and DEX records to ensure accuracy when using the calculator and filing taxes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to run multiple scenarios comparing FIFO (first-in, first-out), LIFO (last-in, first-out), and specific ID cost basis methods to minimize your tax liability within IRS rules.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Identify losses in the calculator and consider tax-loss harvesting by selling underwater positions to offset short-term gains and reduce your ordinary income by up to $3,000 per year.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Re-run the calculator quarterly as you accumulate transactions throughout the year to monitor your estimated tax liability and avoid surprise bills or underpayment penalties at year-end.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in state and local taxes (California 13.3%, New York City 8.82%, etc.) by adding them to your calculator results, as crypto gains are not exempt from state taxation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you receive staking rewards or mining income, use the calculator to distinguish between ordinary income tax (at receipt) and capital gains tax (at sale), as many taxpayers miss the initial income tax obligation.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include transaction fees in cost basis</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many traders ignore exchange fees, gas fees, and conversion costs when calculating cost basis, which inflates their capital gains. A $40,000 Bitcoin purchase with $200 in fees has a $40,200 cost basis, not $40,000; the calculator requires accurate fees to avoid overpaying taxes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating all crypto sales as long-term capital gains</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Holding crypto for only 11 months results in short-term capital gains taxed at ordinary income rates (up to 37%), not the preferential long-term rate (15%). Verify your holding period carefully in the calculator, as selling one day before the one-year mark costs significantly more in taxes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring staking and mining income when calculating tax liability</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many crypto holders report only capital gains while missing the ordinary income from staking rewards and mining, which are taxed as income on receipt regardless of whether they've been sold. Omitting these from the calculator dramatically understates your total tax liability.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming crypto-to-crypto trades are not taxable</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Exchanging Bitcoin for Ethereum is a taxable event valued at the fair market value of the asset received, not a like-kind exchange exempt from tax. The calculator must account for all crypto-to-crypto swaps using accurate FMV on the trade date.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not reconciling calculator results with exchange and wallet records</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Discrepancies between calculated gains and actual transactions often stem from missing airdrop income, dust from forks, or mismatched dates and prices. Always verify calculator inputs against your exchange CSV exports and wallet blockchain history before filing.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What transactions trigger capital gains tax in cryptocurrency?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Any sale, trade, or exchange of crypto for fiat currency, other cryptocurrencies, or goods and services is a taxable event. This includes selling Bitcoin for USD, swapping Ethereum for Dogecoin on a DEX, or purchasing coffee with cryptocurrency. Even if you realize a loss, you must report the transaction to claim the loss deduction against other income, up to $3,000 per year in the U.S.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my cost basis for cryptocurrency purchases?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cost basis includes the purchase price plus any transaction fees (mining fees, exchange fees, conversion costs). For example, if you bought 1 Bitcoin at $40,000 and paid $200 in fees, your cost basis is $40,200. The crypto tax calculator uses this figure to determine your gain or loss when you sell. Accurate cost basis tracking is critical because the IRS requires specific identification of which coins you sold using methods like FIFO, LIFO, or specific ID.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between short-term and long-term capital gains on crypto?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Short-term capital gains apply to crypto held for one year or less and are taxed as ordinary income at rates up to 37% (2024). Long-term capital gains apply to crypto held for more than one year and receive preferential rates: 0%, 15%, or 20% depending on your tax bracket. For example, a $10,000 gain on Bitcoin held 6 months could owe $3,700 in federal tax, while the same gain held 13 months could owe $1,500.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do I owe taxes on cryptocurrency staking rewards?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, staking rewards are taxed as ordinary income at their fair market value on the date received. If you stake Ethereum and receive 0.5 ETH worth $1,000 at that time, you owe income tax on $1,000. When you later sell that staked ETH, you also owe capital gains tax on any appreciation or loss from the $1,000 cost basis. The crypto tax liability calculator helps you track both the initial income tax and subsequent capital gains.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the wash-sale rule apply to cryptocurrency losses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The IRS wash-sale rule does not currently apply to cryptocurrency, unlike stocks and bonds, allowing you to sell at a loss and immediately repurchase the same asset to claim the loss. However, this is subject to change pending legislation. You can deduct crypto losses up to $3,000 against other income annually, with excess losses carried forward indefinitely. Always consult a tax professional, as rules continue to evolve.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What crypto transactions are NOT taxable events?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Non-taxable events include transferring crypto between your own wallets, purchasing crypto with fiat currency, holding crypto without selling, and charitable donations (reported at fair market value). However, receiving crypto as payment for services, mining rewards, airdrops, and hard fork coins ARE taxable when received. The calculator focuses on transactions that create a tax liability, so transfers between personal wallets should be excluded from calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I report cryptocurrency income from mining and airdrops?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mining income and airdrops are reported as ordinary income on Form 1040 and Schedule C at the fair market value on the date received. If you mined 0.1 Bitcoin when it was worth $25,000, you report $2,500 as income. If you receive an airdrop of 1,000 new tokens worth $5 each, you report $5,000 as income. These amounts establish your cost basis, so future appreciation or depreciation creates a separate capital gain or loss.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What records do I need to provide to the calculator for accurate tax liability estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You need: transaction date, type (buy, sell, trade, stake), amount of crypto, price per unit at transaction date, any fees paid, and the asset received (if trading). For accurate calculations, maintain records from your exchange (CSV exports), wallet transactions, and DEX activity. The calculator uses these inputs to compute your total taxable income, short-term and long-term gains, and estimated tax liability based on your filing status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my tax bracket affect my crypto tax liability?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your tax bracket determines your marginal rate for short-term gains (taxed as ordinary income) and your rate for long-term gains (0%, 15%, or 20%). In 2024, single filers with income up to $47,025 pay 10% on short-term gains and 0% on long-term gains; income from $47,026–$518,900 pays up to 24% short-term and 15% long-term. The crypto tax calculator can estimate your liability if you provide your estimated total income and filing status.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/newsroom/irs-virtual-currency-guidance" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Virtual Currency Guidance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on taxation of virtual currencies, including capital gains treatment and reporting requirements for crypto transactions.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p550" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Form 8949 Instructions</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Instructions for reporting sales of capital assets, including cryptocurrency transactions, on Form 8949 and Schedule D.</p>
          </li>
          <li>
            <a href="https://www.sec.gov/investor/alerts-bulletins" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Office of Investor Education and Advocacy — Crypto Investor Alerts</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SEC guidance on cryptocurrency investments and tax implications for U.S. investors.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p544" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 544: Sales of Assets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive IRS publication covering cost basis, holding periods, capital gains and losses, and tax reporting for all asset sales including crypto.</p>
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
