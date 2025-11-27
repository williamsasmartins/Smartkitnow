import { useState, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";

export default function undefinedCalculator() {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const resultsRef = useRef(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const monthlyPayment = useMemo(() => {
    const principalAmount = parseFloat(principal);
    const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (!principalAmount || !monthlyInterestRate || !numberOfPayments) {
      return 0;
    }

    const payment =
      (principalAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    return payment;
  }, [principal, interestRate, loanTerm]);

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Loan Payment Calculator</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-full">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-lg text-4xl text-center">
            {formatCurrency(monthlyPayment)}
          </div>
        </div>
        <div>
          <label htmlFor="principal" className="block text-sm font-medium">
            Principal Amount
          </label>
          <Input
            id="principal"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium">
            Annual Interest Rate (%)
          </label>
          <Input
            id="interestRate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="loanTerm" className="block text-sm font-medium">
            Loan Term (Years)
          </label>
          <Input
            id="loanTerm"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">On This Page</h2>
        <ul className="list-disc list-inside">
          <li>How to Use the Calculator</li>
          <li>Understanding Loan Payments</li>
          <li>Factors Affecting Your Loan</li>
          <li>Tips for Managing Loans</li>
          <li>Frequently Asked Questions</li>
        </ul>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Formula</h2>
        <p>
          The formula used to calculate the monthly loan payment is:
          <br />
          <code>
            M = P[r(1+r)^n]/[(1+r)^n – 1]
          </code>
          <br />
          Where:
          <ul className="list-disc list-inside">
            <li>M = monthly payment</li>
            <li>P = principal loan amount</li>
            <li>r = monthly interest rate</li>
            <li>n = number of payments</li>
          </ul>
        </p>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Example Calculation</h2>
        <ol className="list-decimal list-inside">
          <li>Principal Amount: $100,000</li>
          <li>Annual Interest Rate: 5%</li>
          <li>Loan Term: 30 years</li>
          <li>Monthly Payment: $536.82</li>
        </ol>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Related Calculators</h2>
        <ul className="list-disc list-inside">
          <li>Mortgage Calculator</li>
          <li>Car Loan Calculator</li>
          <li>Personal Loan Calculator</li>
          <li>Student Loan Calculator</li>
          <li>Interest Rate Calculator</li>
          <li>Amortization Calculator</li>
        </ul>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Frequently Asked Questions</h2>
        <div>
          <h3 className="text-xl font-bold">What is a loan payment?</h3>
          <p>
            A loan payment is the amount a borrower is required to pay each month until a debt is paid off. It typically includes both principal and interest.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold">How is the interest rate applied?</h3>
          <p>
            The interest rate is applied to the remaining balance of the loan. It is usually expressed as an annual percentage rate (APR).
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold">Can I pay off my loan early?</h3>
          <p>
            Yes, most loans allow for early repayment. However, some may have prepayment penalties, so it's important to check the terms of your loan.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold">What affects my loan payment?</h3>
          <p>
            Factors such as the loan amount, interest rate, and loan term can all affect your monthly payment. Additional fees and insurance may also impact the total cost.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold">What is amortization?</h3>
          <p>
            Amortization is the process of spreading out a loan into a series of fixed payments over time. It helps in understanding how much of each payment goes towards principal and interest.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold">How can I lower my monthly payment?</h3>
          <p>
            You can lower your monthly payment by extending the loan term, refinancing at a lower interest rate, or making a larger down payment.
          </p>
        </div>
      </div>
    </div>
  );
}