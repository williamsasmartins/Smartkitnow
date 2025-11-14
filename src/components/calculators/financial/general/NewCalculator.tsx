import React, { useState } from 'react';

const DivisionCalculator: React.FC = () => {
    const [numerator, setNumerator] = useState<string>('');
    const [denominator, setDenominator] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);
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

        const divisionResult = (num / denom).toFixed(2);
        setResult(divisionResult);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Division Calculator</h1>
            <form onSubmit={handleCalculate} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label htmlFor="numerator" className="block text-sm font-medium text-gray-700">Numerator</label>
                    <input
                        type="text"
                        id="numerator"
                        value={numerator}
                        onChange={(e) => setNumerator(e.target.value)}
                        placeholder="Enter numerator"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="denominator" className="block text-sm font-medium text-gray-700">Denominator</label>
                    <input
                        type="text"
                        id="denominator"
                        value={denominator}
                        onChange={(e) => setDenominator(e.target.value)}
                        placeholder="Enter denominator"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Calculate</button>
            </form>
            {result !== null && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                    <h2 className="text-lg font-semibold">Result:</h2>
                    <p className="text-xl">{result}</p>
                </div>
            )}
        </div>
    );
};

export default DivisionCalculator;