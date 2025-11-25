import React, { useState } from 'react';
import { Calculator, DollarSign, Calendar } from 'lucide-react';

interface LoanCalculatorProps {}

const LoanPaymentCalculator: React.FC<LoanCalculatorProps> = () => {
    const [principal, setPrincipal] = useState<number>(0);
    const [interestRate, setInterestRate] = useState<number>(0);
    const [term, setTerm] = useState<number>(0);
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
    const [totalPayment, setTotalPayment] = useState<number | null>(null);
    const [totalInterest, setTotalInterest] = useState<number | null>(null);

    const calculatePayment = () => {
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = term * 12;

        const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
        const total = payment * numberOfPayments;
        const interest = total - principal;

        setMonthlyPayment(payment);
        setTotalPayment(total);
        setTotalInterest(interest);
    };

    return (
        <div className="calculator-container">
            <h1 className="calculator-title">
                <Calculator size={24} /> Loan Payment Calculator
            </h1>
            <div className="calculator-inputs">
                <div>
                    <label htmlFor="principal">Principal ($):</label>
                    <input
                        type="number"
                        id="principal"
                        value={principal}
                        onChange={(e) => setPrincipal(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label htmlFor="interestRate">Interest Rate (%):</label>
                    <input
                        type="number"
                        id="interestRate"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label htmlFor="term">Term (Years):</label>
                    <input
                        type="number"
                        id="term"
                        value={term}
                        onChange={(e) => setTerm(Number(e.target.value))}
                    />
                </div>
                <button onClick={calculatePayment}>Calculate</button>
            </div>
            {monthlyPayment !== null && (
                <div className="calculator-results">
                    <h2>Results</h2>
                    <p>Monthly Payment: ${monthlyPayment.toFixed(2)}</p>
                    <p>Total Payment: ${totalPayment?.toFixed(2)}</p>
                    <p>Total Interest: ${totalInterest?.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default LoanPaymentCalculator;