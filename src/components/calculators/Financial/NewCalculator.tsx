import React, { useState } from 'react';

const DivisionCalculator: React.FC = () => {
    const [numerator, setNumerator] = useState<string>('');
    const [denominator, setDenominator] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string>('');

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);

        const num = parseFloat(numerator);
        const denom = parseFloat(denominator);

        if (isNaN(num) || isNaN(denom)) {
            setError('Please enter valid numbers.');
            return;
        }

        if (denom === 0) {
            setError('Denominator cannot be zero.');
            return;
        }

        setResult(num / denom);
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Division Calculator</h2>
            <form onSubmit={handleCalculate} className="flex flex-col">
                <label className="mb-2">
                    Numerator:
                    <input
                        type="text"
                        value={numerator}
                        onChange={(e) => setNumerator(e.target.value)}
                        placeholder="Enter numerator"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>
                <label className="mb-2">
                    Denominator:
                    <input
                        type="text"
                        value={denominator}
                        onChange={(e) => setDenominator(e.target.value)}
                        placeholder="Enter denominator"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                >
                    Calculate
                </button>
            </form>
            {result !== null && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Result:</h3>
                    <p className="text-xl">{result}</p>
                </div>
            )}
        </div>
    );
};

export default DivisionCalculator;