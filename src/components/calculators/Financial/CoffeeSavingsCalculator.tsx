import React, { useState } from 'react';
import { Coffee, DollarSign, Calendar } from 'lucide-react';

const CoffeeSavingsCalculator: React.FC = () => {
  const [coffeePrice, setCoffeePrice] = useState<number>(0);
  const [homeBrewCost, setHomeBrewCost] = useState<number>(0);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(0);
  const [savings, setSavings] = useState<number | null>(null);

  const calculateSavings = () => {
    const weeklyShopCost = coffeePrice * daysPerWeek;
    const weeklyHomeCost = homeBrewCost * daysPerWeek;
    const weeklySavings = weeklyShopCost - weeklyHomeCost;
    const annualSavings = weeklySavings * 52; // Assuming 52 weeks in a year
    setSavings(annualSavings);
  };

  return (
    <div className="calculator-container">
      <h1>Coffee Savings Calculator</h1>
      <div className="calculator-inputs">
        <div>
          <label htmlFor="coffeePrice">Cost of Coffee at Shop ($):</label>
          <input
            type="number"
            id="coffeePrice"
            value={coffeePrice}
            onChange={(e) => setCoffeePrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="homeBrewCost">Cost of Brewing at Home ($):</label>
          <input
            type="number"
            id="homeBrewCost"
            value={homeBrewCost}
            onChange={(e) => setHomeBrewCost(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="daysPerWeek">Days per Week:</label>
          <input
            type="number"
            id="daysPerWeek"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
          />
        </div>
        <button onClick={calculateSavings}>Calculate Savings</button>
      </div>
      {savings !== null && (
        <div className="savings-result">
          <h2>Your Annual Savings: ${savings.toFixed(2)}</h2>
          <Coffee size={24} />
          <DollarSign size={24} />
          <Calendar size={24} />
        </div>
      )}
      <EditorialContent />
    </div>
  );
};

const EditorialContent: React.FC = () => {
  return (
    <article>
      <section>
        <h2>Introduction</h2>
        <p>
          In today's fast-paced world, coffee has become a staple for many of us. 
          However, buying coffee daily from a coffee shop can quickly add up. 
          This calculator helps you understand how much you can save by brewing coffee at home.
        </p>
      </section>
      <section>
        <h2>Core Concepts</h2>
        <p>
          To effectively use this calculator, you need to understand the basic concepts of cost comparison. 
          The main factors include the price of coffee at a shop, the cost of brewing at home, 
          and how often you purchase coffee.
        </p>
      </section>
      <section>
        <h2>How to Use</h2>
        <p>
          Enter the cost of coffee at your favorite coffee shop, the cost of brewing coffee at home, 
          and how many days a week you typically buy coffee. 
          Click the "Calculate Savings" button to see your potential annual savings.
        </p>
      </section>
      <section>
        <h2>Practical Standards</h2>
        <p>
          On average, a cup of coffee from a coffee shop can range from $3 to $5. 
          Brewing coffee at home can cost anywhere from $0.50 to $1.00 per cup, depending on the quality of the beans and equipment used.
        </p>
      </section>
      <section>
        <h2>Hidden Factors</h2>
        <p>
          Consider additional factors such as the time spent brewing coffee at home, 
          the convenience of grabbing coffee on the go, and the quality of coffee you prefer. 
          These can affect your overall satisfaction and willingness to brew at home.
        </p>
      </section>
      <section>
        <h2>The Math Behind It</h2>
        <p>
          The formula for calculating your savings is straightforward:
          <br />
          <strong>Annual Savings = (Weekly Shop Cost - Weekly Home Cost) * 52</strong>
          <br />
          Where:
          <ul>
            <li>Weekly Shop Cost = Cost of Coffee at Shop * Days per Week</li>
            <li>Weekly Home Cost = Cost of Brewing at Home * Days per Week</li>
          </ul>
        </p>
      </section>
      <section>
        <h2>Real-World Examples</h2>
        <p>
          Let's say you buy coffee for $4 a cup, brew at home for $0.75, and buy coffee 5 days a week:
          <br />
          <strong>Weekly Shop Cost = 4 * 5 = $20</strong>
          <br />
          <strong>Weekly Home Cost = 0.75 * 5 = $3.75</strong>
          <br />
          <strong>Annual Savings = (20 - 3.75) * 52 = $844.00</strong>
        </p>
      </section>
      <section>
        <h2>FAQ</h2>
        <dl>
          <dt>Is brewing coffee at home really cheaper?</dt>
          <dd>Yes, brewing coffee at home is generally cheaper than buying it from a coffee shop.</dd>
          <dt>What if I only buy coffee occasionally?</dt>
          <dd>The savings will be less significant, but you can still save money over time.</dd>
          <dt>Can I use this calculator for other beverages?</dt>
          <dd>Yes, you can adapt the inputs for any beverage to see potential savings.</dd>
        </dl>
      </section>
    </article>
  );
};

export default CoffeeSavingsCalculator;


### Explanation of the Code

1. **Imports**: The component imports necessary React hooks and icons from `lucide-react`.
2. **State Management**: It uses `useState` to manage inputs for coffee prices, days per week, and the calculated savings.
3. **Calculate Function**: The `calculateSavings` function computes the savings based on user inputs.
4. **UI Structure**: The component is structured with semantic HTML tags, including sections for the editorial content.
5. **Editorial Content**: The `EditorialContent` component contains detailed sections that cover the requirements specified, ensuring a comprehensive understanding of the calculator's purpose and functionality.

### Styling and Additional Features

To enhance the user experience, consider adding CSS styles for the calculator layout, button hover effects, and responsive design. You may also want to implement form validation and error handling for better usability.

This implementation provides a solid foundation for a Coffee Savings Calculator that is both functional and informative, surpassing basic calculators in depth and utility.