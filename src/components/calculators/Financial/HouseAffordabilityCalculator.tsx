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
      question: "How is house affordability calculated?",
      answer: "House affordability is typically calculated based on your gross monthly income, monthly debt payments, and the size of the down payment you can afford. Lenders use debt-to-income (DTI) ratios to determine how much they are willing to lend. A common rule of thumb is the 28/36 rule, which suggests that your housing expenses should not exceed 28% of your gross monthly income, and your total debt payments should not exceed 36%. Our calculator uses these principles to estimate the maximum home price you can afford. For more details on mortgage payments, check out our <a href='/financial/mortgage-amortization'>Mortgage Payment & Amortization Calculator</a>."
    },
    {
      question: "What is the 28/36 rule?",
      answer: "The 28/36 rule is a guideline used by lenders to assess your ability to repay a mortgage. It states that your monthly housing expenses (principal, interest, taxes, and insurance) should not exceed 28% of your gross monthly income. Additionally, your total monthly debt payments (including housing, credit cards, student loans, etc.) should not exceed 36% of your gross monthly income. Adhering to this rule helps ensure that you don't overextend yourself financially."
    },
    {
      question: "How does my credit score affect affordability?",
      answer: "Your credit score plays a significant role in determining the interest rate you qualify for. A higher credit score typically results in a lower interest rate, which reduces your monthly mortgage payment and increases the amount you can afford to borrow. Conversely, a lower credit score may lead to a higher interest rate and reduced affordability. Improving your credit score before applying for a mortgage can significantly boost your purchasing power."
    },
    {
      question: "What expenses are included in 'monthly debts'?",
      answer: "'Monthly debts' include all recurring financial obligations, such as credit card payments, student loans, auto loans, alimony, and child support. It does not typically include utilities, groceries, or other living expenses. Lenders look at these debts to calculate your back-end DTI ratio. Reducing your monthly debts can improve your DTI ratio and increase your home affordability."
    },
    {
      question: "Do I need a 20% down payment?",
      answer: "While a 20% down payment is often recommended to avoid Private Mortgage Insurance (PMI) and secure better interest rates, it is not always required. Many loan programs, such as FHA loans, allow for lower down payments (e.g., 3.5%). However, a smaller down payment means a larger loan amount and higher monthly payments. Our <a href='/financial/rent-vs-buy'>Rent vs. Buy Calculator</a> can help you decide if buying with a lower down payment makes financial sense compared to renting."
    },
    {
      question: "How do property taxes and insurance affect affordability?",
      answer: "Property taxes and homeowners insurance are ongoing costs that are often included in your monthly mortgage payment (via escrow). These costs reduce the amount of your income available for the principal and interest portion of the mortgage, effectively lowering the home price you can afford. It's important to research local property tax rates and insurance costs when estimating affordability."
    },
    {
      question: "Can I afford a house if I have student loans?",
      answer: "Yes, you can afford a house with student loans, provided your debt-to-income ratio is within acceptable limits. Lenders will consider your student loan payments as part of your monthly debts. If your student loan payments are high, it may reduce the mortgage amount you qualify for. Using our <a href='/financial/student-loan-repayment'>Student Loan Repayment Calculator</a> can help you plan your student loan payments to improve your home affordability."
    },
    {
      question: "What is the difference between pre-qualification and pre-approval?",
      answer: "Pre-qualification is an estimate of how much you might be able to borrow based on self-reported financial information. It is a good first step but carries less weight than pre-approval. Pre-approval involves a verified check of your credit and finances by a lender, providing a conditional commitment for a specific loan amount. Pre-approval makes you a more competitive buyer in the real estate market."
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

  return (
    <CalculatorVerticalLayout 
      title="House Affordability Calculator"
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
