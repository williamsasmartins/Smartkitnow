import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input, Button } from "@/components/ui"; // Assuming you have UI components
import { Calculator, CheckCircle } from "lucide-react";

interface LoanCalculatorProps {
  principal: number;
  rate: number;
  term: number;
}

export default function LoanPaymentCalculator() {
  const [principal, setPrincipal] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [term, setTerm] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const calculateMonthlyPayment = (principal: number, rate: number, term: number): number => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    return payment;
  };

  const handleCalculate = () => {
    const payment = calculateMonthlyPayment(principal, rate, term);
    setMonthlyPayment(payment);
  };

  const widget = (
    <div>
      <Input
        type="number"
        placeholder="Principal Amount"
        value={principal}
        onChange={(e) => setPrincipal(Number(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Annual Interest Rate (%)"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Loan Term (Years)"
        value={term}
        onChange={(e) => setTerm(Number(e.target.value))}
      />
      <Button onClick={handleCalculate}>
        <Calculator size={16} /> Calculate
      </Button>
      {monthlyPayment !== null && (
        <div>
          <h3>
            Monthly Payment: <CheckCircle size={16} /> ${monthlyPayment.toFixed(2)}
          </h3>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial">
      <section>
        <h2>Loan Payment Calculator</h2>
        <p>
          A loan payment calculator is a valuable tool for anyone considering taking out a loan. Whether you are looking to buy a home, finance a car, or consolidate debt, understanding your monthly payments can help you make informed financial decisions.
        </p>
      </section>
      <section>
        <h2>Understanding Loan Payments</h2>
        <p>
          Loan payments consist of two main components: principal and interest. The principal is the amount of money you borrow, while the interest is the cost of borrowing that money. The total amount you pay each month will depend on these two factors, as well as the term of the loan.
        </p>
        <ul>
          <li>
            <strong>Principal:</strong> The original sum of money borrowed in a loan.
          </li>
          <li>
            <strong>Interest Rate:</strong> The percentage charged on the principal, typically expressed as an annual percentage rate (APR).
          </li>
          <li>
            <strong>Loan Term:</strong> The length of time over which the loan is to be repaid, usually expressed in years.
          </li>
        </ul>
      </section>
      <section>
        <h2>How to Use the Loan Payment Calculator</h2>
        <p>
          Using the loan payment calculator is straightforward. Follow these steps:
        </p>
        <ol>
          <li>Enter the principal amount you wish to borrow.</li>
          <li>Input the annual interest rate.</li>
          <li>Specify the loan term in years.</li>
          <li>Click on the "Calculate" button to see your monthly payment.</li>
        </ol>
      </section>
      <section>
        <h2>Factors Affecting Your Loan Payments</h2>
        <p>
          Several factors can influence your loan payments, including:
        </p>
        <ul>
          <li>
            <strong>Credit Score:</strong> A higher credit score can lead to lower interest rates.
          </li>
          <li>
            <strong>Loan Type:</strong> Different types of loans (e.g., fixed-rate vs. adjustable-rate) have different payment structures.
          </li>
          <li>
            <strong>Down Payment:</strong> A larger down payment can reduce the principal and lower monthly payments.
          </li>
        </ul>
      </section>
      <section>
        <h2>Benefits of Using a Loan Payment Calculator</h2>
        <p>
          Utilizing a loan payment calculator can provide several benefits:
        </p>
        <ul>
          <li>Quickly estimate monthly payments based on different loan scenarios.</li>
          <li>Compare different loan options to find the most affordable choice.</li>
          <li>Plan your budget effectively by understanding your financial commitments.</li>
        </ul>
      </section>
      <section>
        <h2>Conclusion</h2>
        <p>
          A loan payment calculator is an essential tool for anyone looking to borrow money. By understanding how to calculate your monthly payments, you can make better financial decisions and ensure that you choose a loan that fits your budget. Remember to consider all factors, including your credit score and loan type, to find the best loan for your needs.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Loan Payment Calculator"
      description="Calculate your monthly loan payments instantly. Enter principal, interest rate, and term to see your exact payment schedule."
      widget={widget}
      editorial={editorial}
    />
  );
}