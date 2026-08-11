import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Home, TrendingUp, Share2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MortgageAmortizationCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();

  // STATE
  const [inputs, setInputs] = useState({
    homePrice: searchParams.get("price") || "",
    downPayment: searchParams.get("down") || "",
    interestRate: searchParams.get("rate") || "",
    loanTerm: searchParams.get("term") || "",
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results if params exist on mount
  useEffect(() => {
    if (searchParams.size > 0 && inputs.homePrice && inputs.interestRate && inputs.loanTerm) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // HELPER
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
    const homePriceValue = parseFloat(inputs.homePrice) || 0;
    const downPaymentValue = parseFloat(inputs.downPayment) || 0;
    const annualRate = parseFloat(inputs.interestRate) || 0;
    const monthlyRate = annualRate / 100 / 12;
    const termMonths = (parseFloat(inputs.loanTerm) || 0) * 12;

    // Principal is home price minus down payment
    let principal = homePriceValue - downPaymentValue;

    // Validate
    if (principal <= 0 || monthlyRate <= 0 || termMonths <= 0) {
      return {
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: 0,
        loanAmount: principal > 0 ? principal : 0,
        scheduleData: [] as Array<{
          month: number;
          payment: number;
          principal: number;
          interest: number;
          balance: number;
        }>,
      };
    }

    const loanAmount = principal;

    // Standard amortization formula
    const monthlyPayment =
      (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - principal;

    // Build amortization schedule
    const scheduleData = Array.from({ length: termMonths }, (_, i) => {
      const interestPayment = principal * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      principal -= principalPayment;
      return {
        month: i + 1,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: principal > 0 ? principal : 0,
      };
    });

    return { monthlyPayment, totalInterest, totalPayment, loanAmount, scheduleData };
  }, [inputs]);

  // HANDLERS
  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ homePrice: "", downPayment: "", interestRate: "", loanTerm: "" });
    setSearchParams({});
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (inputs.homePrice) params.set("price", inputs.homePrice);
    if (inputs.downPayment) params.set("down", inputs.downPayment);
    if (inputs.interestRate) params.set("rate", inputs.interestRate);
    if (inputs.loanTerm) params.set("term", inputs.loanTerm);

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
    navigator.clipboard.writeText(newUrl);
    toast.success("Link copied to clipboard!");
  };

  const faqs = [
    {
      question: "What is a mortgage amortization schedule?",
      answer:
        "A mortgage amortization schedule is a table showing every monthly payment across the life of your loan, split into how much goes toward interest and how much reduces your principal balance. Early in a 30-year mortgage, the vast majority of each payment covers interest; over time, that ratio shifts toward principal. For a $320,000 loan at 6.5% over 30 years, your first payment applies roughly $1,733 to interest and only $290 to principal, while your final payments are almost entirely principal. This calculator builds the full schedule so you can see exactly when you cross the halfway point on equity.",
    },
    {
      question: "How much should my down payment be?",
      answer:
        "A 20% down payment is the classic benchmark because it lets you avoid Private Mortgage Insurance (PMI), which typically costs 0.5%–1.5% of the loan amount annually. On a $400,000 home, 20% means $80,000 down and an $320,000 loan. Many buyers put down less—FHA loans allow as little as 3.5%, and conventional loans can go to 3%—but a smaller down payment means a larger loan, higher monthly payments, more total interest, and usually PMI until you reach 20% equity. Enter different down payment amounts above to see the impact instantly.",
    },
    {
      question: "Does this calculator include property tax, insurance, and PMI?",
      answer:
        "No—this calculator shows the principal and interest (P&I) portion of your payment only, which is the core mortgage math. Your actual monthly housing cost also includes property taxes (roughly 0.5%–2.5% of home value per year depending on your state), homeowners insurance ($1,000–$3,000/year typically), and PMI if your down payment is under 20%. These are often bundled into your payment through an escrow account. To estimate your true monthly cost, add roughly 1/12 of your annual tax + insurance + PMI to the P&I figure this calculator produces.",
    },
    {
      question: "How does the loan term affect my mortgage?",
      answer:
        "A shorter term means higher monthly payments but dramatically less total interest. On a $320,000 loan at 6.5%, a 30-year term costs about $2,023/month with roughly $408,000 in total interest, while a 15-year term costs about $2,787/month but only about $181,000 in total interest—a savings of over $225,000. The trade-off is affordability: the 15-year payment is about $764 higher each month. Use the term field above to compare 15, 20, and 30-year scenarios for your own numbers.",
    },
    {
      question: "What is the difference between interest rate and APR on a mortgage?",
      answer:
        "The interest rate is the raw cost of borrowing your principal, while the APR (Annual Percentage Rate) folds in lender fees, points, and certain closing costs to reflect the loan's true annual cost. A mortgage might advertise a 6.25% interest rate but carry a 6.45% APR once origination fees and points are included. This calculator uses the interest rate for the payment math (which is how lenders compute your actual monthly payment), but you should compare loan offers using APR to understand the full cost.",
    },
    {
      question: "How can I pay off my mortgage faster?",
      answer:
        "Making extra principal payments is the most effective strategy. Adding just $200/month to a $320,000 loan at 6.5% over 30 years can shave off roughly 5 years and save over $90,000 in interest. Other approaches include making biweekly payments (which results in 13 full payments per year instead of 12), refinancing to a shorter term when rates drop, or applying windfalls like tax refunds directly to principal. Because early payments are mostly interest, extra principal early in the loan has the biggest impact on total interest saved.",
    },
    {
      question: "When does it make sense to refinance my mortgage?",
      answer:
        "Refinancing generally makes sense when you can lower your interest rate by at least 0.5%–1%, and you plan to stay in the home long enough to recoup the closing costs (typically 2%–5% of the loan amount). For example, refinancing a $320,000 loan from 7.5% to 6.5% could lower your payment by about $215/month; if closing costs are $8,000, your break-even point is about 37 months. Refinancing also lets you switch from a 30-year to a 15-year term or convert an adjustable-rate mortgage to a fixed rate.",
    },
    {
      question: "What credit score do I need for the best mortgage rate?",
      answer:
        "A credit score of 760 or higher typically qualifies you for the lowest available mortgage rates. Scores between 700–759 still get competitive rates, while scores in the 620–699 range face progressively higher rates and may require a larger down payment. The difference is substantial: a borrower with a 760 score might get 6.25% while a 660-score borrower gets 7.25% on the same loan—on a $320,000 30-year mortgage, that 1% gap adds about $215/month and over $77,000 in total interest. Check and improve your credit before applying.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUTS */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Home className="w-4 h-4 text-blue-600" />
              Home Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 400000"
              value={inputs.homePrice}
              onChange={(e) => setInputs({ ...inputs, homePrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Down Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 80000"
              value={inputs.downPayment}
              onChange={(e) => setInputs({ ...inputs, downPayment: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 6.5"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600" />
              Loan Term (years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.loanTerm}
              onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
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
          <Calculator className="mr-2 h-4 w-4" />
          Calculate
        </Button>
        <Button onClick={handleReset} variant="outline" className="border-gray-300 dark:border-gray-600">
          Reset
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 px-3"
          title="Share result"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* RESULTS */}
      {results.monthlyPayment > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>

          {/* CHART */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Cost Breakdown (Principal vs. Interest)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Principal", value: results.loanAmount, fill: "#3b82f6" },
                      { name: "Interest", value: results.totalInterest, fill: "#f43f5e" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[{ fill: "#3b82f6" }, { fill: "#f43f5e" }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    itemStyle={{ color: "#1e293b" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Monthly Payment (Principal &amp; Interest)
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.monthlyPayment)}
                    </p>
                  </div>
                  <Home className="w-16 h-16 text-blue-600 dark:text-blue-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            {/* LOAN AMOUNT */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Loan Amount</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.loanAmount)}
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* TOTAL INTEREST */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Total Interest</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalInterest)}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* TOTAL PAYMENT */}
            <Card className="col-span-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total of All Payments (over full term)
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalPayment)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AMORTIZATION TABLE */}
          {results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Amortization Schedule
                  </span>
                  {results.scheduleData.length > 12 && (
                    <Button
                      onClick={() => setShowFullTable(!showFullTable)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {showFullTable
                        ? "Show Less"
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

  // EDITORIAL
  const editorial = (
    <div className="space-y-12">
      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use the Mortgage Payment &amp; Amortization Calculator
        </h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            This mortgage calculator estimates your monthly home loan payment and builds a full
            amortization schedule so you can see how each payment splits between principal and
            interest over the life of the loan. Enter your home price, down payment, interest rate,
            and loan term to instantly see your monthly principal-and-interest payment, your total
            interest cost, and the complete month-by-month breakdown of how your balance shrinks.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            The four inputs are: (1) <strong>Home Price</strong>—the purchase price of the property;
            (2) <strong>Down Payment</strong>—the cash you pay upfront, which is subtracted from the
            price to determine your loan amount; (3) <strong>Interest Rate</strong>—your annual
            mortgage rate as a percentage; and (4) <strong>Loan Term</strong>—the length of the loan
            in years, most commonly 15 or 30. Your loan amount (the principal) is simply the home
            price minus your down payment.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Your results show four key figures: the monthly principal-and-interest payment, the loan
            amount financed, the total interest paid across the full term, and the total of all
            payments combined. The amortization table below reveals a crucial pattern—in the early
            years, most of each payment goes to interest, while in the later years it shifts almost
            entirely to principal. Remember this calculator covers principal and interest only;
            budget separately for property taxes, homeowners insurance, and PMI.
          </p>
        </div>
      </section>

      {/* TABLE 1: Payment by term */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">
          Monthly Payment &amp; Total Interest by Loan Term ($320,000 loan at 6.5% APR)
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
          This comparison shows how choosing a shorter term raises your monthly payment but slashes
          the total interest you pay over the life of the loan.
        </p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Term</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment (P&amp;I)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr className="bg-white dark:bg-slate-900">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 years</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,787</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$181,600</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$501,600</td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 years</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,385</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$252,500</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$572,500</td>
              </tr>
              <tr className="bg-white dark:bg-slate-900">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30 years</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,023</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$408,200</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$728,200</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Figures are principal and interest only and assume a fixed rate. Moving from a 30-year to a
          15-year term on this loan saves about $226,600 in interest.
        </p>
      </section>

      {/* TABLE 2: Down payment impact */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">
          Impact of Down Payment ($400,000 home, 6.5% APR, 30 years)
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
          A larger down payment lowers your loan amount, your monthly payment, your total interest,
          and helps you avoid PMI once you reach 20% down.
        </p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Down Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">% Down</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">PMI Required?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr className="bg-white dark:bg-slate-900">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$14,000</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5%</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$386,000</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,440</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$40,000</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$360,000</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,275</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
              </tr>
              <tr className="bg-white dark:bg-slate-900">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$80,000</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$320,000</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,023</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$120,000</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$280,000</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,770</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Reaching 20% down eliminates PMI, which can save $150–$400 per month on a loan of this
          size. Payments shown are principal and interest only.
        </p>
      </section>

      {/* TABLE 3: How a payment splits over time */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">
          How a Payment Splits Over Time ($320,000 loan, 6.5%, 30 years)
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
          Every payment is the same $2,023, but the share going to principal grows each year while
          the interest share falls—this is the heart of amortization.
        </p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Payment #</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toward Interest</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toward Principal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr className="bg-white dark:bg-slate-900">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Month 1</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,733</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$290</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$319,710</td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Month 120 (year 10)</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,470</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$553</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$270,600</td>
              </tr>
              <tr className="bg-white dark:bg-slate-900">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Month 240 (year 20)</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$938</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,085</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$171,100</td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Month 360 (final)</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,012</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          It takes roughly 19 years on a 30-year loan before more of your payment goes to principal
          than to interest. Extra principal payments accelerate this dramatically.
        </p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">
            Aim for a 20% down payment to avoid PMI—on a $400,000 home that means $80,000 down, and
            skipping PMI can save $150–$400 every month until you would otherwise reach 20% equity.
          </li>
          <li className="text-sm text-slate-700 dark:text-slate-300">
            Compare a 15-year and a 30-year term in the calculator above—the shorter term costs more
            monthly but can save you well over $200,000 in interest on a typical loan if you can
            afford the higher payment.
          </li>
          <li className="text-sm text-slate-700 dark:text-slate-300">
            Add an extra principal payment when you can—because early payments are mostly interest,
            even $200/month extra early in the loan can cut years off the term and tens of thousands
            off total interest.
          </li>
          <li className="text-sm text-slate-700 dark:text-slate-300">
            Remember to budget beyond principal and interest—property taxes, homeowners insurance,
            HOA dues, and PMI can add 25%–40% on top of the payment this calculator shows.
          </li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Treating the P&amp;I payment as your full housing cost
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This calculator shows principal and interest only. Your real monthly outlay also
              includes property taxes, homeowners insurance, and often PMI—commonly adding 25%–40%
              on top of the number shown here.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Entering the home price as the loan amount
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your loan is the home price minus your down payment. This calculator subtracts the down
              payment for you, so enter the full purchase price in the Home Price field and your cash
              down separately.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Choosing the longest term just for a lower payment
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A 30-year term has the lowest monthly payment but by far the highest total interest.
              Always look at the total interest figure, not just the monthly payment, before locking
              in a term.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Using an advertised rate instead of your actual quoted rate
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Headline rates assume excellent credit and specific conditions. Get a personalized rate
              quote and enter that into the calculator—a difference of even 0.5% meaningfully changes
              your payment and total cost.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References &amp; Resources
        </h2>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/owning-a-home/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Consumer Financial Protection Bureau — Owning a Home
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Official government guides on mortgages, closing costs, and comparing loan offers by APR.
            </p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/releases/h15/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Federal Reserve — Selected Interest Rates
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Authoritative source for current benchmark interest rate data that influences mortgage rates.
            </p>
          </li>
          <li>
            <a href="https://www.hud.gov/topics/buying_a_home" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              U.S. Department of Housing and Urban Development — Buying a Home
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              HUD resources on FHA loans, down payment assistance, and the home-buying process.
            </p>
          </li>
          <li>
            <a href="https://www.fanniemae.com/education" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Fannie Mae — Homebuyer Education
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Educational materials on mortgage qualification, PMI, and understanding amortization.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mortgage Payment & Amortization Calculator"
      description="Estimate your monthly mortgage payment and see the full amortization schedule. Enter home price, down payment, rate, and term to view principal, interest, and total cost."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Use This Calculator" },
        { id: "table-1", label: "Payment by Loan Term" },
        { id: "table-2", label: "Down Payment Impact" },
        { id: "table-3", label: "How a Payment Splits Over Time" },
        { id: "tips", label: "Pro Tips" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={{
        formula: "M = P[r(1+r)^n] / [(1+r)^n – 1]",
        variables: [
          { symbol: "M", description: "Monthly payment (principal & interest)" },
          { symbol: "P", description: "Loan amount = home price − down payment" },
          { symbol: "r", description: "Monthly interest rate (annual rate ÷ 12)" },
          { symbol: "n", description: "Number of payments (loan term in years × 12)" },
        ],
        title: "Mortgage Payment Formula",
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "A $400,000 home with an $80,000 (20%) down payment, a 6.5% interest rate, and a 30-year term.",
        steps: [
          {
            label: "Step 1",
            calculation: "Loan amount: $400,000 − $80,000 = $320,000",
            explanation: "Subtract the down payment from the home price to get the principal.",
          },
          {
            label: "Step 2",
            calculation: "Monthly rate: 6.5% ÷ 12 = 0.0054167; Payments: 30 × 12 = 360",
            explanation: "Convert the annual rate to monthly and the term to months.",
          },
          {
            label: "Step 3",
            calculation:
              "M = 320000[0.0054167(1.0054167)^360] / [(1.0054167)^360 − 1] ≈ $2,023",
            explanation: "Apply the amortization formula to get the monthly principal & interest.",
          },
        ],
        result:
          "The monthly principal-and-interest payment is approximately $2,023, with about $408,200 paid in total interest over the 30-year term.",
      }}
      relatedCalculators={[
        { title: "Auto Loan Calculator", url: "/financial/auto-loan", icon: "🚗" },
        { title: "Loan Payment Calculator", url: "/financial/loan-payment", icon: "💵" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" },
        { title: "House Affordability Calculator", url: "/financial/house-affordability", icon: "🏠" },
      ]}
    />
  );
}
