import React, { useState } from 'react';
import { Calculator, DollarSign, CheckCircle, XCircle } from 'lucide-react';

interface ExpenseCategory {
  name: string;
  budgeted: number;
  actual: number;
}

const initialCategories: ExpenseCategory[] = [
  { name: 'Venue', budgeted: 0, actual: 0 },
  { name: 'Catering', budgeted: 0, actual: 0 },
  { name: 'Photography', budgeted: 0, actual: 0 },
  { name: 'Attire', budgeted: 0, actual: 0 },
  { name: 'Flowers', budgeted: 0, actual: 0 },
  { name: 'Entertainment', budgeted: 0, actual: 0 },
  { name: 'Miscellaneous', budgeted: 0, actual: 0 },
];

const WeddingBudgetPlanner: React.FC = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>(initialCategories);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalActual, setTotalActual] = useState<number>(0);

  const handleBudgetChange = (index: number, value: number) => {
    const newCategories = [...categories];
    newCategories[index].budgeted = value;
    setCategories(newCategories);
    calculateTotals(newCategories);
  };

  const handleActualChange = (index: number, value: number) => {
    const newCategories = [...categories];
    newCategories[index].actual = value;
    setCategories(newCategories);
    calculateTotals(newCategories);
  };

  const calculateTotals = (categories: ExpenseCategory[]) => {
    const budgetSum = categories.reduce((sum, category) => sum + category.budgeted, 0);
    const actualSum = categories.reduce((sum, category) => sum + category.actual, 0);
    setTotalBudget(budgetSum);
    setTotalActual(actualSum);
  };

  return (
    <div className="wedding-budget-planner">
      <h1 className="text-3xl font-bold mb-4">
        <Calculator className="inline mr-2" /> Wedding Budget Planner
      </h1>
      <div className="budget-summary mb-4">
        <h2 className="text-2xl">Budget Summary</h2>
        <p>Total Budget: ${totalBudget.toFixed(2)}</p>
        <p>Total Actual: ${totalActual.toFixed(2)}</p>
        <p>
          Remaining Budget: ${Math.max(0, totalBudget - totalActual).toFixed(2)}
        </p>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Budgeted</th>
            <th className="border border-gray-300 px-4 py-2">Actual</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.name}>
              <td className="border border-gray-300 px-4 py-2">{category.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={category.budgeted}
                  onChange={(e) => handleBudgetChange(index, Number(e.target.value))}
                  className="border border-gray-400 p-1"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={category.actual}
                  onChange={(e) => handleActualChange(index, Number(e.target.value))}
                  className="border border-gray-400 p-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <h2 className="text-2xl">Final Thoughts</h2>
        <p>
          Use this planner to keep track of your wedding expenses and ensure you stay within your budget.
        </p>
      </div>
    </div>
  );
};

export default WeddingBudgetPlanner;