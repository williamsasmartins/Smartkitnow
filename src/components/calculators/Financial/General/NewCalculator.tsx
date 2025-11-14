import React, { useState } from 'react';

export default function NewCalculator() {
  const [value, setValue] = useState(0);
  const [result, setResult] = useState(0);

  const handleCalculate = () => {
    setResult(value * 2);
  };

  return (
    <div>
      <h1>Calculator</h1>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => setValue(Number(e.target.value))} 
      />
      <button onClick={handleCalculate}>Calculate</button>
      {result > 0 && <div>Result: {result}</div>}
    </div>
  );
}