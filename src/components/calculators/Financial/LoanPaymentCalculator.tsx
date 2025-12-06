import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Info,
  HelpCircle,
  BookOpen,
} from "lucide-react";

interface AmortizationRow {
  month: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function LoanPaymentCalculator() {
  const [inputs, setInputs] = useState({
    principal: "25000",
    interestRate: "6.5",
    termMonths: "60",
    startDate: "",
  });

  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const principal = parseFloat(inputs.principal) || 0;
    const annualRate = parseFloat(inputs.interestRate) || 0;
    const termMonths = parseFloat(inputs.termMonths) || 0;

    if (principal <= 0 || termMonths <= 0) {
      return {
        monthlyPayment: 0,
        totalPaid: 0,
        totalInterest: 0,
        payoffDateLabel: "",
        amortizationSchedule: [] as AmortizationRow[],
      };
    }

    const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0;

    let monthlyPayment = 0;

    if (monthlyRate === 0) {
      // No interest – simple division
      monthlyPayment = principal / termMonths;
    } else {
      const pow = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = (principal * monthlyRate * pow) / (pow - 1);
    }

    const schedule: AmortizationRow[] = [];
    let balance = principal;
    let totalPaid = 0;
    let totalInterest = 0;

    const today = new Date();
    const baseDate = inputs.startDate ? new Date(inputs.startDate) : today;

    for (let i = 1; i <= termMonths; i++) {
      const interestPayment = monthlyRate > 0 ? balance * monthlyRate : 0;
      let principalPayment = monthlyPayment - interestPayment;

      if (principalPayment > balance) {
        principalPayment = balance;
      }

      const paymentAmount = principalPayment + interestPayment;

      balance = balance - principalPayment;
      if (balance < 0.01) {
        balance = 0;
      }

      totalPaid += paymentAmount;
      totalInterest += interestPayment;

      const paymentDate = new Date(baseDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      const dateLabel = paymentDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      schedule.push({
        month: i,
        date: dateLabel,
        payment: paymentAmount,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });

      if (balance <= 0) break;
    }

    const payoffRow = schedule[schedule.length - 1];
    const payoffDateLabel = payoffRow?.date ?? "";

    return {
      monthlyPayment,
      totalPaid,
      totalInterest,
      payoffDateLabel,
      amortizationSchedule: schedule,
    };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const handleReset = () => {
    setInputs({
      principal: "",
      interestRate: "",
      termMonths: "",
      startDate: "",
    });
    setShowFullSchedule(false);
  };

  const formatCurrency = (value: number) => {
    if (!isFinite(value) || isNaN(value)) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatNumber = (value: number, digits: number = 2) => {
    if (!isFinite(value) || isNaN(value)) return "0";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const hasValidResult = results.monthlyPayment > 0 && results.amortizationSchedule.length > 0;

  const displaySchedule = showFullSchedule
    ? results.amortizationSchedule
    : results.amortizationSchedule.slice(0, 12);

  return (
    <CalculatorVerticalLayout
      title="Loan Payment Calculator"
      description="Estimate your monthly loan payment, total interest, and payoff date for personal loans, auto loans, or other amortizing debt. Enter the principal, interest rate, and term to see a full payment schedule."
      onThisPage={[
        { id: "how-to-use", label: "How to use this calculator" },
        { id: "formula", label: "Loan payment formula" },
        { id: "factors", label: "What affects loan payments" },
        { id: "examples", label: "Worked examples" },
        { id: "faq", label: "Frequently asked questions" },
        { id: "references", label: "References & additional resources" },
      ]}
      formula={{
        title: "Standard amortizing loan payment formula",
        formula: "M = P × [ r(1 + r)^n ] / [ (1 + r)^n − 1 ]",
        variables: [
          {
            symbol: "M",
            label: "Monthly payment",
            description: "The fixed amount you pay every month.",
          },
          {
            symbol: "P",
            label: "Principal",
            description: "The amount you borrow (loan amount).",
          },
          {
            symbol: "r",
            label: "Monthly interest rate",
            description: "Annual interest rate divided by 12 and by 100.",
          },
          {
            symbol: "n",
            label: "Number of payments",
            description: "Total number of monthly payments over the term.",
          },
        ],
      }}
      example={{
        title: "Example: Financing a $25,000 auto loan",
        scenario:
          "You borrow $25,000 at 6.5% APR for 60 months (5 years) and want to know your monthly payment, total paid, and total interest.",
        steps: [
          {
            step: 1,
            description: "Convert the annual interest rate to a monthly rate",
            calculation: "r = 6.5% ÷ 12 ÷ 100 = 0.0054167",
          },
          {
            step: 2,
            description: "Determine the number of monthly payments",
            calculation: "n = 60 months",
          },
          {
            step: 3,
            description: "Apply the loan payment formula",
            calculation: "M = 25,000 × [0.0054167(1 + 0.0054167)^60] / [(1 + 0.0054167)^60 − 1]",
          },
          {
            step: 4,
            description: "Calculate the monthly payment",
            calculation: "M ≈ $489.00 per month",
          },
        ],
        result:
          "Your estimated payment is about $489 per month for 60 months, with roughly $4,340 in total interest and $29,340 paid in total.",
      }}
      relatedCalculators={[
        { title: "Amortization Schedule Calculator", url: "/financial/amortization-schedule", icon: "📊" },
        { title: "Auto Loan Calculator", url: "/financial/auto-loan", icon: "🚗" },
        { title: "Mortgage Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Loan Payoff Calculator", url: "/financial/loan-payoff", icon: "💰" },
        { title: "Debt Consolidation Calculator", url: "/financial/debt-consolidation", icon: "📉" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💹" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={
        <div className="space-y-6">
          {/* ==================== INPUTS ==================== */}
          <Card className="border-0 shadow-none">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Loan details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <Label htmlFor="principal">Loan amount (principal)</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <Input
                    id="principal"
                    type="number"
                    inputMode="decimal"
                    placeholder="25000"
                    value={inputs.principal}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, principal: e.target.value }))
                    }
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interestRate">Interest rate (APR %)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="6.5"
                    value={inputs.interestRate}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, interestRate: e.target.value }))
                    }
                    className="mt-1 h-11 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="termMonths">Loan term (months)</Label>
                  <Input
                    id="termMonths"
                    type="number"
                    inputMode="decimal"
                    placeholder="60"
                    value={inputs.termMonths}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, termMonths: e.target.value }))
                    }
                    className="mt-1 h-11 text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="startDate">Optional: first payment date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={inputs.startDate}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="mt-1 h-11 text-base"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Used only for labeling payment dates in the amortization schedule.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ==================== ACTION BUTTONS ==================== */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCalculate}
              className="flex-1 h-11 text-base font-semibold flex items-center justify-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Calculate payment
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 h-11 text-base font-medium"
            >
              Reset
            </Button>
          </div>

          {/* ==================== RESULTS GRID ==================== */}
          {hasValidResult && (
            <div ref={resultsRef} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Monthly Payment */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Monthly payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                      ${formatCurrency(results.monthlyPayment)}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      Based on your loan amount, rate, and term.
                    </p>
                  </CardContent>
                </Card>

                {/* Total Interest */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      💸 Total interest paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                      ${formatCurrency(results.totalInterest)}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      Cost of borrowing over the full term.
                    </p>
                  </CardContent>
                </Card>

                {/* Total Paid */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      📊 Total amount paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      ${formatCurrency(results.totalPaid)}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      Principal + interest over the life of the loan.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Payoff date + quick insight */}
              {results.payoffDateLabel && (
                <Card className="bg-slate-900 text-slate-50 dark:bg-slate-950 border border-slate-700 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Info className="h-4 w-4 text-emerald-400" />
                      Payoff timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base">
                      At this payment amount, your loan will be paid off around{" "}
                      <span className="font-semibold">{results.payoffDateLabel}</span>, assuming
                      on-time payments and a fixed interest rate.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* ==================== AMORTIZATION TABLE ==================== */}
              {displaySchedule.length > 0 && (
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      Payment schedule (amortization table)
                    </CardTitle>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      See how each payment is split between principal and interest and how your
                      balance decreases over time.
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-14">#</TableHead>
                            <TableHead>Payment date</TableHead>
                            <TableHead className="text-right">Payment</TableHead>
                            <TableHead className="text-right">Principal</TableHead>
                            <TableHead className="text-right">Interest</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displaySchedule.map((row) => (
                            <TableRow key={row.month}>
                              <TableCell>{row.month}</TableCell>
                              <TableCell>{row.date}</TableCell>
                              <TableCell className="text-right">
                                ${formatCurrency(row.payment)}
                              </TableCell>
                              <TableCell className="text-right">
                                ${formatCurrency(row.principal)}
                              </TableCell>
                              <TableCell className="text-right">
                                ${formatCurrency(row.interest)}
                              </TableCell>
                              <TableCell className="text-right">
                                ${formatCurrency(row.balance)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {results.amortizationSchedule.length > 12 && (
                      <div className="flex justify-between items-center px-4 py-3 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Showing {displaySchedule.length} of {results.amortizationSchedule.length} payments.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFullSchedule((prev) => !prev)}
                          className="text-xs"
                        >
                          {showFullSchedule ? "Show first 12 payments" : "Show full schedule"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      }
      editorial={
        <div className="space-y-12">
          {/* ==================== HOW TO USE ==================== */}
          <section id="how-to-use" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              How to use the loan payment calculator
            </h2>
            <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              This loan payment calculator helps you estimate how much you&apos;ll pay each month
              for a fixed-rate, fully amortizing loan. It works well for personal loans, auto
              loans, small business loans, and other traditional installment debt.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
              <li>
                <span className="font-semibold">Enter the loan amount (principal).</span>{" "}
                This is the amount you plan to borrow after any down payment.
              </li>
              <li>
                <span className="font-semibold">Add the interest rate (APR).</span>{" "}
                Use the <em>annual</em> percentage rate quoted by your lender, not a monthly rate.
              </li>
              <li>
                <span className="font-semibold">Set the loan term in months.</span>{" "}
                For example, 36, 48, 60 or 72 months are common for auto loans.
              </li>
              <li>
                <span className="font-semibold">Optionally choose a first payment date.</span>{" "}
                This doesn&apos;t change the math but helps label the amortization schedule.
              </li>
              <li>
                <span className="font-semibold">Click &quot;Calculate payment&quot;.</span>{" "}
                You&apos;ll see your monthly payment, total interest, total paid, and a full payment schedule.
              </li>
            </ol>
            <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              Use these results to compare offers from different lenders, test shorter or longer
              terms, and understand how interest costs change over time.
            </p>
          </section>

          {/* ==================== FORMULA SECTION ==================== */}
          <section id="formula" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              The math behind loan payment calculations
            </h2>
            <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              Most installment loans use a standard <strong>amortization formula</strong>. This
              formula ensures that every payment is the same amount, but the mix of principal and
              interest changes over time as your balance shrinks.
            </p>
            <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              Early payments are interest-heavy because the outstanding balance is still large.
              Later payments become more principal-heavy as the balance declines. The calculator
              reproduces this schedule month by month so you can see exactly how your loan will
              behave.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              If the interest rate is zero, the calculation simplifies: your monthly payment is
              simply the principal divided by the number of months. In that special case, there is no
              interest portion at all—every payment directly reduces the balance.
            </p>
          </section>

          {/* ==================== FACTORS ==================== */}
          <section id="factors" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              What affects your monthly loan payment?
            </h2>
            <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              Three main levers control your monthly payment and total interest:{" "}
              <strong>loan amount</strong>, <strong>interest rate</strong>, and{" "}
              <strong>term length</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
              <li>
                <span className="font-semibold">Loan amount (principal).</span>{" "}
                Larger loans naturally create higher payments and more total interest. A bigger
                down payment reduces the amount financed and can dramatically lower both.
              </li>
              <li>
                <span className="font-semibold">Interest rate (APR).</span>{" "}
                Even small changes in APR can have a big impact on total interest over several
                years. Improving your credit score or shopping multiple lenders can often shave
                off percentage points and save thousands.
              </li>
              <li>
                <span className="font-semibold">Term length.</span>{" "}
                Longer terms reduce the monthly payment but increase the number of payments, so
                you usually pay much more interest overall. Shorter terms are tougher on your
                budget but cheaper in the long run.
              </li>
            </ul>
            <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              Use the calculator to experiment: try shortening the term by 12 months, or test
              variations in the interest rate you might get with a better credit score. Watching the
              total interest and payoff date change is a powerful way to make more informed
              borrowing decisions.
            </p>
          </section>

          {/* ==================== EXAMPLES ==================== */}
          <section id="examples" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              Example scenarios: how payment choices change the cost
            </h2>
            <h3 className="text-2xl font-semibold mt-4 mb-2 text-slate-900 dark:text-slate-100">
              Example 1: Shorter term vs. longer term
            </h3>
            <p className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">
              Suppose you&apos;re comparing a $20,000 loan at 7.0% APR with two options:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2 text-slate-700 dark:text-slate-300">
              <li>36 months (3 years)</li>
              <li>60 months (5 years)</li>
            </ul>
            <p className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">
              The 36-month option will have a much higher monthly payment, but you&apos;ll
              be out of debt sooner and pay far less interest overall. The 60-month option
              fits more easily into your monthly budget but costs more in the long run.
            </p>

            <h3 className="text-2xl font-semibold mt-6 mb-2 text-slate-900 dark:text-slate-100">
              Example 2: Improving your interest rate
            </h3>
            <p className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">
              Now imagine you can either accept a 10.5% APR or qualify for 7.5% APR on the
              same $15,000 loan over 48 months.
            </p>
            <p className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">
              The monthly payment difference might seem modest, but over 4 years the lower
              rate can save you hundreds of dollars in interest. Use the calculator to
              plug in both rates and compare the total interest side by side.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              This is a good reminder to treat interest rate as more than just a small
              percentage—over time it becomes a major cost driver for any loan.
            </p>
          </section>

          {/* ==================== FAQ ==================== */}
          <section id="faq" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Frequently asked questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  Does this calculator include taxes, insurance, or fees?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  No. This tool focuses on the core <strong>principal and interest</strong> payment
                  for a fixed-rate, fully amortizing loan. Real-world payments may also include
                  taxes, insurance, origination fees, late fees, or other charges depending on the
                  type of loan and your lender&apos;s policies.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  What happens if I make extra payments?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Extra principal payments reduce your balance faster, which lowers the amount of
                  interest that accrues each month. The result is an earlier payoff date and less
                  total interest paid. This version of the calculator does not model extra
                  payments, but you can still experiment by shortening the term or lowering the loan
                  amount to approximate their impact.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  Can I use this for credit card debt?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  You can approximate revolving credit scenarios, but credit cards usually charge
                  interest daily and payments may not be fixed. For precise projections, look for a
                  credit card–specific payoff calculator, but this tool is still useful for rough
                  planning and &quot;what if&quot; scenarios.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  Is this financial advice?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  No. The calculator is for educational and planning purposes only and does not
                  replace professional financial advice. Always review loan documents carefully and
                  consult a qualified financial professional or credit counselor if you are unsure
                  which option is best for your situation.
                </p>
              </div>
            </div>
          </section>

          {/* ==================== REFERENCES ==================== */}
          <section id="references" className="scroll-mt-32">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              References & additional resources
            </h2>
            <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              These resources provide more detail on loan terminology, borrowing costs, and how to
              compare offers from different lenders.
            </p>
            <ul className="space-y-4">
              <li className="leading-relaxed">
                <a
                  href="https://www.consumerfinance.gov/consumer-tools/loans/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Consumer Financial Protection Bureau – Loans & Credit
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Official explanations of common loan types, key terms, and questions to ask
                  before you borrow.
                </p>
              </li>
              <li className="leading-relaxed">
                <a
                  href="https://www.fdic.gov/resources/consumers/money-smart"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  FDIC Money Smart – Borrowing basics
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Educational materials from the Federal Deposit Insurance Corporation on how loans
                  work and how to avoid common borrowing pitfalls.
                </p>
              </li>
              <li className="leading-relaxed">
                <a
                  href="https://studentaid.gov/understand-aid/types/loans"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Federal Student Aid – Types of student loans
                </a>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Detailed overview of federal student loan programs, repayment plans, and how
                  interest accrues over time.
                </p>
              </li>
            </ul>
          </section>
        </div>
      }
    />
  );
}
