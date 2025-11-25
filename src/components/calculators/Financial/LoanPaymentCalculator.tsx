import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input, Button } from "@/components/ui"; // Assuming you have a UI library
import { Calculator, DollarSign, Calendar } from "lucide-react";

interface LoanCalculatorProps {
  principal: number;
  interestRate: number;
  term: number;
}

const LoanPaymentCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [term, setTerm] = useState<number>(0);

  const monthlyPayment = useMemo(() => {
    if (principal <= 0 || interestRate <= 0 || term <= 0) return 0;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = term * 12;
    return (
      (principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
    );
  }, [principal, interestRate, term]);

  return (
    <CalculatorVerticalLayout
      title="Loan Payment Calculator"
      description="Calculate your monthly loan payments instantly. Enter principal, interest rate, and term to see your exact payment schedule."
      widget={
        <div className="calculator-widget">
          <h2 className="text-lg font-bold mb-4">Calculate Your Payment</h2>
          <div className="input-group mb-4">
            <label htmlFor="principal" className="block mb-1">
              Principal Amount ($)
            </label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              placeholder="Enter principal amount"
              startAdornment={<DollarSign />}
            />
          </div>
          <div className="input-group mb-4">
            <label htmlFor="interestRate" className="block mb-1">
              Annual Interest Rate (%)
            </label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              placeholder="Enter interest rate"
              startAdornment={<Calculator />}
            />
          </div>
          <div className="input-group mb-4">
            <label htmlFor="term" className="block mb-1">
              Loan Term (Years)
            </label>
            <Input
              id="term"
              type="number"
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              placeholder="Enter loan term"
              startAdornment={<Calendar />}
            />
          </div>
          <Button onClick={() => {}} className="w-full">
            Calculate Payment
          </Button>
          <h3 className="mt-4 text-lg font-bold">Monthly Payment: ${monthlyPayment.toFixed(2)}</h3>
        </div>
      }
      editorial={
        <div className="skn-editorial">
          <section>
            <h2>Understanding Loan Payments</h2>
            <p>
              A loan payment calculator is a valuable tool for anyone looking to take out a loan. It allows you to estimate your monthly payments based on the principal amount, interest rate, and loan term. Understanding how these factors interact can help you make informed financial decisions.
            </p>
          </section>
          <section>
            <h2>Key Components of a Loan Payment</h2>
            <ul>
              <li>
                <strong>Principal:</strong> The total amount of money you borrow.
              </li>
              <li>
                <strong>Interest Rate:</strong> The cost of borrowing money, expressed as a percentage.
              </li>
              <li>
                <strong>Term:</strong> The length of time you have to repay the loan, typically in years.
              </li>
            </ul>
          </section>
          <section>
            <h2>How to Use the Loan Payment Calculator</h2>
            <p>
              To use the loan payment calculator effectively, follow these steps:
            </p>
            <ol>
              <li>Enter the principal amount of the loan.</li>
              <li>Input the annual interest rate.</li>
              <li>Specify the loan term in years.</li>
              <li>Click on the "Calculate Payment" button to see your monthly payment.</li>
            </ol>
          </section>
          <section>
            <h2>Why Calculate Your Loan Payments?</h2>
            <p>
              Knowing your monthly payment helps you budget effectively and ensures that you can afford the loan. It also allows you to compare different loan offers and choose the best option for your financial situation.
            </p>
          </section>
          <section>
            <h2>Factors Affecting Your Loan Payment</h2>
            <p>
              Several factors can influence your loan payment, including:
            </p>
            <ul>
              <li>
                <strong>Credit Score:</strong> A higher credit score can lead to lower interest rates.
              </li>
              <li>
                <strong>Loan Type:</strong> Different types of loans (e.g., fixed-rate vs. adjustable-rate) have different payment structures.
              </li>
              <li>
                <strong>Down Payment:</strong> A larger down payment can reduce the principal and monthly payments.
              </li>
            </ul>
          </section>
          <section>
            <h2>Conclusion</h2>
            <p>
              The loan payment calculator is an essential tool for anyone considering a loan. By understanding the components of your loan and how to calculate your payments, you can make informed financial decisions that align with your budget and goals.
            </p>
          </section>
        </div>
      }
    />
  );
};

export default LoanPaymentCalculator;