import React, { useState } from 'react';
import { Pizza, Users, DollarSign } from 'lucide-react';

interface PizzaPartyBudgetCalculatorProps {}

const PizzaPartyBudgetCalculator: React.FC<PizzaPartyBudgetCalculatorProps> = () => {
  const [guestCount, setGuestCount] = useState<number>(0);
  const [appetiteLevel, setAppetiteLevel] = useState<number>(2); // Average 2 slices per person
  const [pizzaSlices, setPizzaSlices] = useState<number>(8); // Average slices per pizza
  const [pizzaCost, setPizzaCost] = useState<number>(15); // Average cost per pizza
  const [totalPizzas, setTotalPizzas] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  const calculatePizzaOrder = () => {
    const totalSlicesNeeded = guestCount * appetiteLevel;
    const pizzasNeeded = Math.ceil(totalSlicesNeeded / pizzaSlices);
    const cost = pizzasNeeded * pizzaCost;

    setTotalPizzas(pizzasNeeded);
    setTotalCost(cost);
  };

  return (
    <div className="calculator-container">
      <h1>Pizza Party Budget Calculator</h1>
      <div className="input-group">
        <label htmlFor="guestCount">
          <Users /> Number of Guests:
        </label>
        <input
          type="number"
          id="guestCount"
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          min={0}
        />
      </div>
      <div className="input-group">
        <label htmlFor="appetiteLevel">
          <Pizza /> Appetite Level (Slices per Person):
        </label>
        <input
          type="number"
          id="appetiteLevel"
          value={appetiteLevel}
          onChange={(e) => setAppetiteLevel(Number(e.target.value))}
          min={1}
        />
      </div>
      <div className="input-group">
        <label htmlFor="pizzaSlices">
          Slices per Pizza:
        </label>
        <input
          type="number"
          id="pizzaSlices"
          value={pizzaSlices}
          onChange={(e) => setPizzaSlices(Number(e.target.value))}
          min={1}
        />
      </div>
      <div className="input-group">
        <label htmlFor="pizzaCost">
          <DollarSign /> Cost per Pizza:
        </label>
        <input
          type="number"
          id="pizzaCost"
          value={pizzaCost}
          onChange={(e) => setPizzaCost(Number(e.target.value))}
          min={0}
        />
      </div>
      <button onClick={calculatePizzaOrder}>Calculate</button>
      <div className="results">
        <h2>Results</h2>
        <p>Total Pizzas Needed: {totalPizzas}</p>
        <p>Total Cost: ${totalCost.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PizzaPartyBudgetCalculator;