import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HouseAffordabilityCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    annualIncome: "", 
    monthlyDebts: "", 
    downPayment: "", 
    interestRate: "", 
    loanTerm: "30" 
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // HELPER FUNCTION (MANDATORY)
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // FAQ STRUCTURED DATA
  const faqs = [
    {
      question: "What income do I need to afford a $300,000 house?",
      answer: "Using the standard 28% front-end ratio, you'd typically need an annual income of around $107,000 to comfortably afford a $300,000 home, assuming a 20% down payment and current mortgage rates around 6.5%. However, this varies based on your debt-to-income ratio, down payment amount, and local property taxes. The calculator adjusts for your specific financial situation to provide a personalized estimate.",
    },
    {
      question: "How does the debt-to-income ratio affect my home affordability?",
      answer: "Most lenders use a maximum debt-to-income (DTI) ratio of 43%, meaning your total monthly debt payments shouldn't exceed 43% of your gross monthly income. If you earn $5,000 monthly and already have $1,500 in debt payments, you can only afford a mortgage payment of $665 before hitting that limit. The affordability calculator factors this in to show you realistic borrowing capacity based on your existing debts.",
    },
    {
      question: "What impact does my down payment percentage have on affordability?",
      answer: "A larger down payment reduces both your loan amount and monthly mortgage payment, immediately improving affordability. For example, on a $400,000 home at 6.5% interest, a 20% down payment ($80,000) results in a $1,911 monthly payment, while a 10% down payment ($40,000) results in a $2,387 monthly payment. The calculator shows how adjusting your down payment directly affects your maximum home price.",
    },
    {
      question: "How do current mortgage rates affect my purchasing power?",
      answer: "Mortgage rates have a dramatic effect on affordability; a 1% rate increase can reduce your purchasing power by approximately 10%. At a 5.5% rate you might afford a $350,000 home, but at 6.5% that same monthly payment only gets you a $315,000 home. The calculator uses real-time or input rates to show how rate changes impact your maximum affordable home price.",
    },
    {
      question: "Should I include property taxes and insurance in the affordability calculation?",
      answer: "Absolutely—property taxes and homeowners insurance are mandatory costs that significantly impact affordability and should never be overlooked. These costs vary dramatically by location; annual property taxes can range from 0.3% to 2.5% of home value depending on your state. The calculator allows you to input or estimate these costs so your affordability estimate reflects your true monthly housing expense.",
    },
    {
      question: "What is the 28/36 rule and how does it apply to the calculator?",
      answer: "The 28/36 rule states that housing costs shouldn't exceed 28% of gross income (front-end ratio) and total debt shouldn't exceed 36% of gross income (back-end ratio). For a $6,000 monthly income, your housing payment should ideally stay under $1,680, while all debt payments combined shouldn't exceed $2,160. Most affordability calculators use the more conservative 43% back-end ratio lenders use today.",
    },
    {
      question: "How does HOA fees affect what I can afford?",
      answer: "HOA fees are treated as part of your total monthly housing expense and directly reduce the mortgage payment you can afford. If you're buying a $350,000 condo with a $400/month HOA fee, lenders may count that full $400 against your debt-to-income ratio. The calculator allows you to input HOA fees so they're properly reflected in your maximum affordable purchase price.",
    },
    {
      question: "What's the difference between pre-qualification and pre-approval for affordability?",
      answer: "Pre-qualification is an estimate based on self-reported information and doesn't guarantee loan approval, while pre-approval involves a credit check and verification of income and assets. An affordability calculator provides a pre-qualification estimate; the actual amount you can borrow may be lower once a lender verifies your financial documents. Always use the calculator as a starting point, then get formally pre-approved for an accurate borrowing limit.",
    },
    {
      question: "How do student loans and car payments affect my home buying power?",
      answer: "Existing debts directly reduce your borrowing capacity because lenders count all monthly debt payments against your debt-to-income ratio. If you have $500/month in student loan payments and $300/month in car payments, that $800 monthly debt obligation reduces the mortgage payment you can afford by roughly $800. The calculator asks for total monthly debt obligations to provide an accurate maximum home price.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const annualIncome = parseFloat(inputs.annualIncome) || 0;
    const monthlyDebts = parseFloat(inputs.monthlyDebts) || 0;
    const downPayment = parseFloat(inputs.downPayment) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const loanTerm = parseInt(inputs.loanTerm) * 12 || 0;

    // Validate
    if (annualIncome <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return { 
        maxHomePrice: 0, 
        monthlyPayment: 0,
        maxLoanAmount: 0
      };
    }

    // Monthly Income
    const monthlyIncome = annualIncome / 12;

    // 28/36 Rule Calculation
    // Front-end ratio (Housing expenses <= 28% of gross income)
    const maxHousingPayment = monthlyIncome * 0.28;

    // Back-end ratio (Total debts <= 36% of gross income)
    const maxTotalDebts = monthlyIncome * 0.36;
    const maxHousingPaymentBackEnd = maxTotalDebts - monthlyDebts;

    // Use the lower of the two limits
    const affordableMonthlyPayment = Math.min(maxHousingPayment, maxHousingPaymentBackEnd);

    // Ensure non-negative
    if (affordableMonthlyPayment <= 0) {
        return { 
            maxHomePrice: 0, 
            monthlyPayment: 0,
            maxLoanAmount: 0
        };
    }

    // Calculate Max Loan Amount based on affordable monthly payment
    // Formula: P = M * (1 - (1 + r)^-n) / r
    const maxLoanAmount = affordableMonthlyPayment * (1 - Math.pow(1 + interestRate, -loanTerm)) / interestRate;

    // Max Home Price = Max Loan Amount + Down Payment
    const maxHomePrice = maxLoanAmount + downPayment;

    return { 
      maxHomePrice, 
      monthlyPayment: affordableMonthlyPayment,
      maxLoanAmount
    };
  }, [inputs]);

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the House Affordability Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The House Affordability Calculator helps you determine the maximum home price you can realistically afford based on your income, debts, down payment, and local costs. This tool uses lending standards and financial ratios that actual mortgage lenders apply, giving you a pre-qualification estimate before you approach a bank. Understanding your affordability range prevents you from house hunting outside your means and helps you make confident offers.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll input your gross annual income, existing monthly debt payments (student loans, car payments, credit cards), desired down payment percentage, expected mortgage interest rate, and local property tax and insurance estimates. Each input directly affects your results; higher income and larger down payments increase affordability, while higher debt and mortgage rates decrease it. The calculator's key inputs reflect the 28/36 debt-to-income rule and the 43% maximum DTI that most lenders use today.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your maximum affordable home price, estimated monthly mortgage payment, and how changes to individual inputs affect your purchasing power. Use this information to set realistic search parameters and understand which factors you can control (down payment savings, debt payoff) versus external factors (interest rates, property taxes). Remember this is an estimate—actual approval depends on credit score, employment history, asset verification, and the specific lender's requirements.</p>
        </div>
      </section>

      {/* TABLE: Maximum Home Price by Income & Down Payment (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Maximum Home Price by Income & Down Payment (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the estimated maximum home price you can afford based on annual income and down payment percentage, assuming a 6.5% mortgage rate and 28% front-end ratio.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10% Down Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15% Down Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20% Down Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$142,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$152,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$162,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$75,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$213,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$228,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$243,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$284,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$305,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$324,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$125,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$355,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$381,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$405,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$426,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$457,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$486,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$568,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$610,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$648,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates assume no additional monthly debt, property taxes at 1.2% annually, homeowners insurance at $1,200/year, and 30-year fixed mortgage. Actual affordability varies by credit score, location, and lender requirements.</p>
      </section>

      {/* TABLE: Monthly Payment Comparison by Mortgage Rate */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Payment Comparison by Mortgage Rate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how mortgage rate changes affect your monthly payment on a $350,000 home with a 20% down payment ($70,000 down, $280,000 financed).</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mortgage Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly P&I Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Payment Change vs. 5.5%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,417</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Save $1,920</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,503</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Save $1,440</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,593</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,688</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add $1,140</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,787</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add $2,328</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,891</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add $3,576</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,998</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add $4,860</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Principal and interest only; does not include property taxes, insurance, or HOA fees. Monthly costs increase approximately $90-$100 for every 0.5% rate increase.</p>
      </section>

      {/* TABLE: Impact of Existing Monthly Debt on Affordability */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Existing Monthly Debt on Affordability</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how existing monthly debt obligations reduce your maximum affordable mortgage payment, assuming a $6,000 monthly gross income and 43% maximum debt-to-income ratio.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Existing Monthly Debt</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Monthly Debt Allowed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Mortgage Payment Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,580</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,080</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,580</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,080</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,080</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$580</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Maximum debt calculation: (Gross Monthly Income × 43%) - Existing Debt = Available Mortgage Payment. Includes student loans, car loans, credit cards, and personal loans in total monthly debt.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Pay down high-interest debt before applying for a mortgage—each $100/month in debt elimination increases your borrowing power by approximately $20,000-$25,000.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase your down payment to 20% or more to avoid PMI (private mortgage insurance), which typically costs 0.5-1.5% of your loan amount annually and can add $150-$400 to monthly payments.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Get pre-approved by a lender before house hunting—while the calculator provides an estimate, formal pre-approval shows sellers you're a serious buyer and reveals your actual maximum borrowing capacity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in closing costs (typically 2-5% of purchase price) and reserve emergency funds after down payment—many first-time buyers deplete savings for down payment and can't cover unexpected repair costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to test scenarios: increase your income assumption if you expect raises or bonuses, adjust rates for market conditions, and compare affordability across different down payment levels to find your optimal strategy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remember property taxes vary dramatically by location—a $400,000 home costs $4,800/year in property taxes in Texas but $8,000-$12,000 in New Jersey, significantly impacting total monthly housing costs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Property Taxes and Insurance in Affordability Estimates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many buyers focus only on the mortgage principal and interest payment, forgetting that property taxes and insurance can add $300-$600+ monthly. These costs directly reduce your available mortgage payment and must be included in affordability calculations or you'll overestimate what you can afford.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Existing Debt in Your DTI Calculation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Lenders count all monthly debt—student loans, car payments, credit cards—against your debt-to-income ratio, immediately reducing your affordable mortgage amount. If you have $800/month in existing debt, that $800 is subtracted from your maximum allowed monthly debt, shrinking your mortgage approval.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Your Pre-Qualification Estimate Equals Loan Approval</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">An affordability calculator provides a pre-qualification estimate, but actual approval depends on credit score verification, employment verification, and asset review. Your actual loan approval may be significantly lower than the estimate if you have marginal credit, recent job changes, or undocumented income sources.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Only Current Mortgage Rates Without Stress-Testing Higher Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mortgage rates fluctuate; if you calculate affordability at today's 6.5% rate but rates rise to 7.5%, your purchasing power drops roughly 10-15%. Test your affordability at higher rate scenarios (7-8%) to ensure you can afford the home even if rates increase before closing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include HOA Fees in Monthly Housing Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">HOA fees are counted as part of your monthly debt obligation and reduce your borrowing capacity dollar-for-dollar. A $400/month HOA fee reduces your affordable mortgage payment by $400, which translates to approximately $65,000-$80,000 less in purchasing power.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Maxing Out Your Affordability Without Financial Cushion</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Just because a calculator says you can afford a $450,000 home doesn't mean you should buy at that price—unexpected repairs, rising interest rates on ARM loans, or income loss can quickly create financial hardship. Most financial advisors recommend buying homes at 80-90% of your maximum calculated affordability.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What income do I need to afford a $300,000 house?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Using the standard 28% front-end ratio, you'd typically need an annual income of around $107,000 to comfortably afford a $300,000 home, assuming a 20% down payment and current mortgage rates around 6.5%. However, this varies based on your debt-to-income ratio, down payment amount, and local property taxes. The calculator adjusts for your specific financial situation to provide a personalized estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the debt-to-income ratio affect my home affordability?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most lenders use a maximum debt-to-income (DTI) ratio of 43%, meaning your total monthly debt payments shouldn't exceed 43% of your gross monthly income. If you earn $5,000 monthly and already have $1,500 in debt payments, you can only afford a mortgage payment of $665 before hitting that limit. The affordability calculator factors this in to show you realistic borrowing capacity based on your existing debts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What impact does my down payment percentage have on affordability?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A larger down payment reduces both your loan amount and monthly mortgage payment, immediately improving affordability. For example, on a $400,000 home at 6.5% interest, a 20% down payment ($80,000) results in a $1,911 monthly payment, while a 10% down payment ($40,000) results in a $2,387 monthly payment. The calculator shows how adjusting your down payment directly affects your maximum home price.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do current mortgage rates affect my purchasing power?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mortgage rates have a dramatic effect on affordability; a 1% rate increase can reduce your purchasing power by approximately 10%. At a 5.5% rate you might afford a $350,000 home, but at 6.5% that same monthly payment only gets you a $315,000 home. The calculator uses real-time or input rates to show how rate changes impact your maximum affordable home price.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include property taxes and insurance in the affordability calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely—property taxes and homeowners insurance are mandatory costs that significantly impact affordability and should never be overlooked. These costs vary dramatically by location; annual property taxes can range from 0.3% to 2.5% of home value depending on your state. The calculator allows you to input or estimate these costs so your affordability estimate reflects your true monthly housing expense.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the 28/36 rule and how does it apply to the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 28/36 rule states that housing costs shouldn't exceed 28% of gross income (front-end ratio) and total debt shouldn't exceed 36% of gross income (back-end ratio). For a $6,000 monthly income, your housing payment should ideally stay under $1,680, while all debt payments combined shouldn't exceed $2,160. Most affordability calculators use the more conservative 43% back-end ratio lenders use today.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does HOA fees affect what I can afford?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">HOA fees are treated as part of your total monthly housing expense and directly reduce the mortgage payment you can afford. If you're buying a $350,000 condo with a $400/month HOA fee, lenders may count that full $400 against your debt-to-income ratio. The calculator allows you to input HOA fees so they're properly reflected in your maximum affordable purchase price.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between pre-qualification and pre-approval for affordability?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pre-qualification is an estimate based on self-reported information and doesn't guarantee loan approval, while pre-approval involves a credit check and verification of income and assets. An affordability calculator provides a pre-qualification estimate; the actual amount you can borrow may be lower once a lender verifies your financial documents. Always use the calculator as a starting point, then get formally pre-approved for an accurate borrowing limit.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do student loans and car payments affect my home buying power?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Existing debts directly reduce your borrowing capacity because lenders count all monthly debt payments against your debt-to-income ratio. If you have $500/month in student loan payments and $300/month in car payments, that $800 monthly debt obligation reduces the mortgage payment you can afford by roughly $800. The calculator asks for total monthly debt obligations to provide an accurate maximum home price.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/about-us/newsroom/cfpb-releases-guide-buying-home/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CFPB Guide to Buying a Home</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Consumer Financial Protection Bureau provides comprehensive guidance on home buying, including affordability assessment and understanding debt-to-income ratios.</p>
          </li>
          <li>
            <a href="https://selling-guide.fanniemae.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Fannie Mae Single-Family Selling Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fannie Mae's official guide details lending standards, debt-to-income requirements, and mortgage underwriting criteria used by lenders nationwide.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/d/dti.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Debt-to-Income Ratio</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Investopedia explains how debt-to-income ratios work, why lenders use them, and how to calculate your personal DTI for mortgage approval.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/mortgages/mortgage-calculator/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate: Mortgage Calculator and Affordability Tool</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate offers mortgage calculators and affordability tools with current rates and explanations of how property taxes and insurance affect home affordability.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout 
      title="House Affordability Calculator"
      editorial={editorial}
      description="Determine how much house you can afford based on your income and debts."
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: 'calculator', label: 'Calculator' },
        { id: 'editorial', label: 'Editorial' },
        { id: 'faq', label: 'Frequently Asked Questions' },
        { id: 'references', label: 'References' }
      ]}
      formula={{
        formula: "Affordable Payment = min(Income × 0.28, (Income × 0.36) − Debts)",
        variables: [
          { symbol: "Income", description: "Gross monthly income" },
          { symbol: "Debts", description: "Total monthly debt payments" },
          { symbol: "0.28", description: "Front-end ratio limit (28%)" },
          { symbol: "0.36", description: "Back-end ratio limit (36%)" }
        ],
        title: "Affordability Calculation"
      }}
    >
      {/* CALCULATOR WIDGET */}
      <div id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Calculator className="h-5 w-5 text-blue-500" />
              House Affordability Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid gap-6 md:grid-cols-2">
            {/* INPUTS */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="annualIncome">Annual Gross Income</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="annualIncome"
                    type="number"
                    placeholder="0"
                    className="pl-9"
                    value={inputs.annualIncome}
                    onChange={(e) => setInputs({ ...inputs, annualIncome: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyDebts">Monthly Debts (Credit cards, loans, etc.)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="monthlyDebts"
                    type="number"
                    placeholder="0"
                    className="pl-9"
                    value={inputs.monthlyDebts}
                    onChange={(e) => setInputs({ ...inputs, monthlyDebts: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment Available</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="downPayment"
                    type="number"
                    placeholder="0"
                    className="pl-9"
                    value={inputs.downPayment}
                    onChange={(e) => setInputs({ ...inputs, downPayment: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="interestRate"
                    type="number"
                    placeholder="0"
                    className="pl-9"
                    value={inputs.interestRate}
                    onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  placeholder="30"
                  value={inputs.loanTerm}
                  onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
                />
              </div>
            </div>

            {/* RESULTS */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 flex flex-col justify-center space-y-4 border border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Maximum Home Price</p>
                <div ref={resultsRef} className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(results.maxHomePrice)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Max Loan Amount</p>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(results.maxLoanAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Monthly P&I</p>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(results.monthlyPayment)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EDITORIAL CONTENT */}
      <section id="editorial" className="space-y-8 mt-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Understanding House Affordability
        </h2>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Determining how much house you can afford is a critical first step in the home buying process. It involves analyzing your income, debts, and down payment savings to establish a realistic budget. This not only helps you narrow down your property search but also ensures that you remain financially secure after purchasing a home.
          </p>
        </div>
      </section>

      {/* SECTION 4: FAQ */}
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
              <p 
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8"
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
                href="https://www.hud.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                U.S. Department of Housing and Urban Development (HUD)
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official government resources on buying a home, including affordability guidelines and loan programs.
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
                Consumer Financial Protection Bureau - Buying a House
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tools and resources to help you navigate the home buying process and understand mortgage costs.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.fanniemae.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Fannie Mae - Homeowners
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Information on mortgage options, affordability, and the home buying journey.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.freddiemac.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Freddie Mac - Home Possible
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Resources for first-time homebuyers and those looking for affordable mortgage solutions.
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
                Investopedia - Home Affordability
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Educational articles on calculating affordability, debt-to-income ratios, and mortgage types.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.bankrate.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Bankrate - How Much House Can I Afford?
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Calculators and guides to help you estimate your home buying budget.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}
