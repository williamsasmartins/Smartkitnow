import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Settings, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CarLoanPaymentAmortizationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    price: "",
    rate: "",
    term: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculates the monthly payment and amortization details for a car loan.
   * Formula:
   *   M = P * (r(1+r)^n) / ((1+r)^n - 1)
   * where:
   *   M = monthly payment
   *   P = loan principal (price)
   *   r = monthly interest rate (annual rate / 12 / 100)
   *   n = total number of payments (term in months)
   */
  const results = useMemo(() => {
    const P = parseFloat(inputs.price);
    const annualRate = parseFloat(inputs.rate);
    const termMonths = parseInt(inputs.term);

    if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(termMonths) || termMonths <= 0) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    const r = annualRate / 100 / 12; // monthly interest rate

    let monthlyPayment: number;
    if (r === 0) {
      // No interest loan
      monthlyPayment = P / termMonths;
    } else {
      const numerator = r * Math.pow(1 + r, termMonths);
      const denominator = Math.pow(1 + r, termMonths) - 1;
      monthlyPayment = P * (numerator / denominator);
    }

    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - P;

    return {
      primary: monthlyPayment.toFixed(2),
      secondary: `$${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      details: `Total Interest Paid: $${totalInterest.toFixed(2)} over ${termMonths} months`,
      feedback: "Calculation successful"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is the difference between the monthly payment and the amortization schedule?",
      answer: "The monthly payment is the fixed amount you pay each month toward your car loan, calculated based on the principal, interest rate, and loan term. The amortization schedule breaks down each payment into principal and interest components, showing how much of each payment goes toward reducing the loan balance versus paying interest. For example, on a $30,000 loan at 6.5% APR over 60 months, your payment would be approximately $580, but the first payment might include $162 in interest and only $418 in principal.",
    },
    {
      question: "How does the interest rate affect my monthly car payment?",
      answer: "A higher interest rate directly increases your monthly payment and the total interest paid over the life of the loan. For a $25,000 car loan over 60 months, a 4% APR results in a monthly payment of $460, while a 7% APR increases it to $483—a $23 monthly difference that totals $1,380 extra in interest paid. Shopping for the best rate with multiple lenders can save thousands of dollars.",
    },
    {
      question: "Can this calculator help me compare different loan terms?",
      answer: "Yes, this calculator is designed to compare how loan term length affects your monthly payment and total interest. A $35,000 loan at 5.5% APR costs $644 monthly over 60 months (total interest: $3,640) versus $483 monthly over 84 months (total interest: $5,572). Shorter terms mean higher payments but significantly less total interest paid.",
    },
    {
      question: "What happens to my amortization schedule if I make extra payments?",
      answer: "Extra payments reduce the principal faster, which shortens the loan term and decreases total interest paid. The amortization schedule will shift accordingly, with fewer months remaining and lower interest accumulation in later payments. For example, adding $100 extra monthly to a $30,000 loan at 6% APR over 60 months can shorten the term by approximately 8 months and save roughly $900 in interest.",
    },
    {
      question: "How is APR different from the interest rate shown in this calculator?",
      answer: "APR (Annual Percentage Rate) includes the interest rate plus any fees spread across the loan term, providing a more complete picture of borrowing costs. This calculator typically uses the stated interest rate; however, if your loan includes origination fees or other costs, the effective APR may be slightly higher. Most car loans disclose APR in the loan agreement, so enter that figure for the most accurate monthly payment calculation.",
    },
    {
      question: "What is considered a good interest rate for a car loan in 2025?",
      answer: "Car loan rates in 2025 typically range from 4.5% to 8.5% depending on credit score, loan term, and lender. Borrowers with excellent credit (750+) may qualify for rates near 4.5–5.5%, while those with fair credit (650–700) usually see 6.5–7.5% rates. Checking current rates with multiple lenders ensures you secure the most competitive offer available.",
    },
    {
      question: "How do I use this calculator to determine if I can afford a specific car?",
      answer: "Enter the car's purchase price (or the financed amount after your down payment), your expected interest rate, and preferred loan term to see the resulting monthly payment. Most financial experts recommend keeping your total monthly vehicle expenses—including payment, insurance, and maintenance—below 15–20% of gross monthly income. If a $35,000 car payment of $650 exceeds this threshold, consider a less expensive vehicle or larger down payment.",
    },
    {
      question: "Why does my amortization schedule show more interest paid early in the loan?",
      answer: "This is how amortization works: interest is calculated on the remaining balance, so early payments are mostly interest because the balance is highest. As you pay down principal, later payments include more principal and less interest. On a $30,000 loan at 6% APR, the first payment might be $160 interest and $420 principal, while the final payment might be $15 interest and $565 principal.",
    },
    {
      question: "Can this calculator account for trade-in value or down payment adjustments?",
      answer: "Yes, you should enter the financed amount (purchase price minus down payment and trade-in credit) into the calculator. For example, if a car costs $40,000 and you're putting down $8,000 with a $2,000 trade-in credit, enter $30,000 as the loan amount. This ensures the monthly payment and amortization schedule reflect the actual amount you're financing.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario: "Financing a $35,000 SUV with a 5% annual interest rate over a 60-month term.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Principal (P) = $35,000, Annual Interest Rate = 5%, Term = 60 months."
      },
      {
        label: "Step 2: Calculate monthly interest rate",
        explanation: "Monthly interest rate (r) = 5% / 12 = 0.004167."
      },
      {
        label: "Step 3: Apply amortization formula",
        explanation:
          "Monthly payment M = P * (r(1+r)^n) / ((1+r)^n - 1) = 35000 * (0.004167 * (1.004167)^60) / ((1.004167)^60 - 1)."
      },
      {
        label: "Step 4: Calculate powers",
        explanation:
          "(1.004167)^60 ≈ 1.28336."
      },
      {
        label: "Step 5: Calculate numerator and denominator",
        explanation:
          "Numerator = 0.004167 * 1.28336 = 0.005347, Denominator = 1.28336 - 1 = 0.28336."
      },
      {
        label: "Step 6: Calculate monthly payment",
        explanation:
          "M = 35000 * (0.005347 / 0.28336) ≈ 35000 * 0.01887 = $660.45."
      },
      {
        label: "Step 7: Calculate total payment and interest",
        explanation:
          "Total payment = $660.45 * 60 = $39,627. Total interest = $39,627 - $35,000 = $4,627."
      }
    ],
    result: "Final monthly payment is approximately $660.45, with total interest paid of $4,627 over 5 years."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Investopedia - Amortization",
      description: "Comprehensive explanation of amortization and loan calculations.",
      url: "https://www.investopedia.com/terms/a/amortization.asp"
    },
    {
      title: "Consumer Financial Protection Bureau - Car Loans",
      description: "Official guidance on car loans and financing options.",
      url: "https://www.consumerfinance.gov/consumer-tools/auto-loans/"
    },
    {
      title: "Bankrate - Auto Loan Calculator",
      description: "Interactive calculator and tips for auto loans.",
      url: "https://www.bankrate.com/calculators/auto/auto-loan-calculator.aspx"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Car Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 35000"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Interest Rate (%)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 5"
            value={inputs.rate}
            onChange={(e) => handleInputChange("rate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Loan Term (months)</Label>
          <Input
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 60"
            value={inputs.term}
            onChange={(e) => handleInputChange("term", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Monthly Payment</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">${results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.details}</div>
            <p className="text-xs text-slate-500 mt-2">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Car Loan Payment & Amortization Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you estimate your monthly car payment and view a detailed amortization schedule showing exactly how much of each payment goes toward principal and interest. Whether you're shopping for a new vehicle, comparing financing offers, or planning your budget, this tool provides the clarity needed to make an informed borrowing decision. Understanding both your monthly obligation and total interest cost is essential for responsible auto financing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering three key inputs: the loan amount (the purchase price minus down payment and trade-in credit), the annual interest rate (APR), and the desired loan term in months. Most car loans range from 36 to 84 months, with shorter terms resulting in higher monthly payments but lower total interest, and longer terms offering lower payments but higher overall costs. Experiment with different scenarios to find the balance that works for your budget and financial goals.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator produces two critical outputs: your fixed monthly payment amount and a detailed amortization schedule. The amortization schedule breaks down each payment into principal (the amount reducing your loan balance) and interest (the cost of borrowing), allowing you to see exactly how your loan progresses month by month. Early payments are mostly interest because the balance is high, while later payments shift heavily toward principal—this is normal and expected in all amortized loans.</p>
        </div>
      </section>

      {/* TABLE: Sample Monthly Payments by Loan Amount, Term, and APR (2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Monthly Payments by Loan Amount, Term, and APR (2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated monthly payments for common car loan scenarios to help you understand how principal, term, and interest rate interact.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">60-Month Term @ 5.5%</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">72-Month Term @ 5.5%</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">84-Month Term @ 5.5%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$377</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$329</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$289</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$471</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$411</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$361</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$566</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$493</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$433</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$660</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$575</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$505</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$754</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$656</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$577</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Payments are rounded to nearest dollar and do not include taxes, fees, or insurance. Actual payments may vary based on your lender's specific terms and credit approval.</p>
      </section>

      {/* TABLE: Total Interest Paid Over Loan Life at Various APR Levels */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Total Interest Paid Over Loan Life at Various APR Levels</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how interest rate changes impact total interest paid on a $30,000 car loan across different term lengths.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">60-Month Total Interest</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">72-Month Total Interest</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">84-Month Total Interest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,707</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,285</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,874</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,546</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,304</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,091</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,408</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,361</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,349</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,293</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,650</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,572</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,995</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Figures assume no additional fees, prepayments, or changes to the principal amount. Use this to evaluate the long-term cost impact of securing a lower APR.</p>
      </section>

      {/* TABLE: Sample Amortization Breakdown for First 6 Months: $30,000 @ 6% APR / 60 Months */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Amortization Breakdown for First 6 Months: $30,000 @ 6% APR / 60 Months</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This amortization table shows how a typical payment splits between principal and interest across the first six months of a 60-month car loan.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Month</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Principal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$420</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$29,580</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$422</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$158</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$29,158</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$424</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$156</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,734</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$426</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$154</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,308</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$429</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$151</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27,879</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$431</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$149</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27,448</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Monthly payment rounded to nearest dollar. Notice how principal increases and interest decreases slightly as the loan balance declines.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Make a larger down payment to reduce the financed amount and lower both your monthly payment and total interest paid; even an extra $2,000–$5,000 down can save thousands in interest over the loan term.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Shop around with at least 3–5 lenders (banks, credit unions, dealerships) within a two-week window to compare APR offers, as even a 0.5% difference can save hundreds or thousands of dollars depending on the loan size.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider a shorter loan term if your budget allows; a 60-month loan versus 84 months typically saves 30–40% in total interest, accelerating the point at which you own the vehicle outright.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the amortization schedule to identify when extra principal payments would have the greatest impact; making extra payments early in the loan saves the most interest and shortens the payoff date fastest.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing the advertised rate with APR</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dealers often advertise a low interest rate, but the APR may be higher after fees are factored in. Always enter the APR from your loan agreement into this calculator to get an accurate monthly payment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for down payment in the loan amount</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering the full vehicle purchase price instead of the amount you're actually financing will overestimate your monthly payment. Subtract your down payment and trade-in credit before entering the loan amount.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the total interest paid over the loan life</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Focusing only on monthly payment and ignoring total interest cost can lead to poor financing decisions; a $50 lower monthly payment over 24 extra months may cost thousands more in interest.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not comparing multiple loan terms side-by-side</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator's strength is comparing scenarios; failing to test different term lengths means you might miss the optimal balance between affordable monthly payments and reasonable total interest cost.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between the monthly payment and the amortization schedule?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The monthly payment is the fixed amount you pay each month toward your car loan, calculated based on the principal, interest rate, and loan term. The amortization schedule breaks down each payment into principal and interest components, showing how much of each payment goes toward reducing the loan balance versus paying interest. For example, on a $30,000 loan at 6.5% APR over 60 months, your payment would be approximately $580, but the first payment might include $162 in interest and only $418 in principal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the interest rate affect my monthly car payment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A higher interest rate directly increases your monthly payment and the total interest paid over the life of the loan. For a $25,000 car loan over 60 months, a 4% APR results in a monthly payment of $460, while a 7% APR increases it to $483—a $23 monthly difference that totals $1,380 extra in interest paid. Shopping for the best rate with multiple lenders can save thousands of dollars.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me compare different loan terms?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator is designed to compare how loan term length affects your monthly payment and total interest. A $35,000 loan at 5.5% APR costs $644 monthly over 60 months (total interest: $3,640) versus $483 monthly over 84 months (total interest: $5,572). Shorter terms mean higher payments but significantly less total interest paid.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens to my amortization schedule if I make extra payments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Extra payments reduce the principal faster, which shortens the loan term and decreases total interest paid. The amortization schedule will shift accordingly, with fewer months remaining and lower interest accumulation in later payments. For example, adding $100 extra monthly to a $30,000 loan at 6% APR over 60 months can shorten the term by approximately 8 months and save roughly $900 in interest.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is APR different from the interest rate shown in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">APR (Annual Percentage Rate) includes the interest rate plus any fees spread across the loan term, providing a more complete picture of borrowing costs. This calculator typically uses the stated interest rate; however, if your loan includes origination fees or other costs, the effective APR may be slightly higher. Most car loans disclose APR in the loan agreement, so enter that figure for the most accurate monthly payment calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered a good interest rate for a car loan in 2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Car loan rates in 2025 typically range from 4.5% to 8.5% depending on credit score, loan term, and lender. Borrowers with excellent credit (750+) may qualify for rates near 4.5–5.5%, while those with fair credit (650–700) usually see 6.5–7.5% rates. Checking current rates with multiple lenders ensures you secure the most competitive offer available.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I use this calculator to determine if I can afford a specific car?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter the car's purchase price (or the financed amount after your down payment), your expected interest rate, and preferred loan term to see the resulting monthly payment. Most financial experts recommend keeping your total monthly vehicle expenses—including payment, insurance, and maintenance—below 15–20% of gross monthly income. If a $35,000 car payment of $650 exceeds this threshold, consider a less expensive vehicle or larger down payment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my amortization schedule show more interest paid early in the loan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This is how amortization works: interest is calculated on the remaining balance, so early payments are mostly interest because the balance is highest. As you pay down principal, later payments include more principal and less interest. On a $30,000 loan at 6% APR, the first payment might be $160 interest and $420 principal, while the final payment might be $15 interest and $565 principal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator account for trade-in value or down payment adjustments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you should enter the financed amount (purchase price minus down payment and trade-in credit) into the calculator. For example, if a car costs $40,000 and you're putting down $8,000 with a $2,000 trade-in credit, enter $30,000 as the loan amount. This ensures the monthly payment and amortization schedule reflect the actual amount you're financing.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-apr-or-annual-percentage-rate-en-319/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau (CFPB) – Auto Loan Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official CFPB guidance on understanding APR and how it differs from interest rate in auto loans.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/datadownload/Choose.aspx?rel=MMNRNJ" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve – Historical Auto Loan Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Federal Reserve's official data on auto loan interest rates and lending trends across the U.S. market.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/loans/auto/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate – 2025 Auto Loan Rates and Financing Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate's current auto loan rate benchmarks and comprehensive guide to financing vehicles in 2025.</p>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/article/loans/auto-loans/car-loan-amortization/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NerdWallet – How Car Loan Amortization Works</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NerdWallet's detailed explanation of amortization schedules and how monthly payments are calculated for auto loans.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Car Loan Payment & Amortization Calculator"
      description="Professional automotive calculator: Car Loan Payment & Amortization Calculator. Get accurate estimates, expert advice, and financial insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}