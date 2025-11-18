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
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Division Calculator</h1>
      <form onSubmit={handleCalculate} className="flex flex-col">
        <label className="mb-2">
          Numerator:
          <input
            type="text"
            value={numerator}
            onChange={(e) => setNumerator(e.target.value)}
            placeholder="Enter numerator"
            className="mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="mb-2">
          Denominator:
          <input
            type="text"
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            placeholder="Enter denominator"
            className="mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Calculate
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result !== null && !error && (
        <p className="mt-4 text-green-600">
          Result: <strong>{result}</strong>
        </p>
      )}
    </div>
  );
};

export default DivisionCalculator;