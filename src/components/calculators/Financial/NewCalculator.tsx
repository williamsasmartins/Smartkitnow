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
            setError('Cannot divide by zero.');
            return;
        }

        setResult(num / denom);
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Division Calculator</h2>
            <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                    <label htmlFor="numerator" className="block text-sm font-medium text-gray-700">Numerator</label>
                    <input
                        type="text"
                        id="numerator"
                        value={numerator}
                        onChange={(e) => setNumerator(e.target.value)}
                        placeholder="Enter numerator"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div>
                    <label htmlFor="denominator" className="block text-sm font-medium text-gray-700">Denominator</label>
                    <input
                        type="text"
                        id="denominator"
                        value={denominator}
                        onChange={(e) => setDenominator(e.target.value)}
                        placeholder="Enter denominator"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
                >
                    Calculate
                </button>
            </form>
            {result !== null && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="text-lg font-medium">Result:</h3>
                    <p className="text-xl">{result}</p>
                </div>
            )}
        </div>
    );
};

export default DivisionCalculator;