import React, { useState } from 'react';
import { Calculator, DollarSign, Calendar } from 'lucide-react';

interface SavingsGoalCalculatorProps {}

const SimpleSavingsGoalCalculator: React.FC<SavingsGoalCalculatorProps> = () => {
    const [goalAmount, setGoalAmount] = useState<number>(0);
    const [currentSavings, setCurrentSavings] = useState<number>(0);
    const [months, setMonths] = useState<number>(0);
    const [monthlySavings, setMonthlySavings] = useState<number | null>(null);

    const calculateMonthlySavings = () => {
        const requiredSavings = (goalAmount - currentSavings) / months;
        setMonthlySavings(requiredSavings > 0 ? requiredSavings : 0);
    };

    return (
        <div className="calculator-container">
            <h1>Simple Savings Goal Calculator</h1>
            <div className="calculator-inputs">
                <div className="input-group">
                    <label htmlFor="goalAmount">
                        <DollarSign /> Goal Amount ($)
                    </label>
                    <input
                        type="number"
                        id="goalAmount"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(Number(e.target.value))}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="currentSavings">
                        <DollarSign /> Current Savings ($)
                    </label>
                    <input
                        type="number"
                        id="currentSavings"
                        value={currentSavings}
                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="months">
                        <Calendar /> Months to Save
                    </label>
                    <input
                        type="number"
                        id="months"
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                    />
                </div>
                <button onClick={calculateMonthlySavings}>Calculate</button>
            </div>
            {monthlySavings !== null && (
                <div className="result">
                    <h2>Monthly Savings Needed: ${monthlySavings.toFixed(2)}</h2>
                </div>
            )}
        </div>
    );
};

export default SimpleSavingsGoalCalculator;