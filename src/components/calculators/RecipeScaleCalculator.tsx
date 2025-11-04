import React, { useState } from 'react';

// Esta calculadora ajusta quantidades de receitas de acordo com o fator de conversão.
interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
}

const RecipeScaleCalculator: React.FC = () => {
  const [originalYield, setOriginalYield] = useState<number>(4);
  const [desiredYield, setDesiredYield] = useState<number>(8);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 0, name: '', amount: 0, unit: '' },
  ]);

  const factor = originalYield > 0 ? desiredYield / originalYield : 0;

  const handleIngredientChange = (
    id: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { id: Date.now(), name: '', amount: 0, unit: '' },
    ]);
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Recipe Scale Conversion</h1>
        <p className="text-sm text-muted-foreground">
          Adjust the quantities in your recipe for any number of servings. Enter
          the original recipe yield and the desired yield, list your
          ingredients, and we'll calculate the new amounts.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="originalYield">
            Original yield
          </label>
          <input
            id="originalYield"
            type="number"
            value={originalYield}
            min={0.1}
            step={0.1}
            onChange={(e) => setOriginalYield(parseFloat(e.target.value) || 0)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="desiredYield">
            Desired yield
          </label>
          <input
            id="desiredYield"
            type="number"
            value={desiredYield}
            min={0.1}
            step={0.1}
            onChange={(e) => setDesiredYield(parseFloat(e.target.value) || 0)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        {ingredients.map((ing) => (
          <div key={ing.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
            <input
              className="col-span-4 rounded-md border px-2 py-1"
              type="text"
              placeholder="Ingredient"
              value={ing.name}
              onChange={(e) => handleIngredientChange(ing.id, 'name', e.target.value)}
            />
            <input
              className="col-span-3 rounded-md border px-2 py-1"
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={ing.amount}
              onChange={(e) => handleIngredientChange(
                ing.id,
                'amount',
                parseFloat(e.target.value) || 0
              )}
            />
            <input
              className="col-span-3 rounded-md border px-2 py-1"
              type="text"
              placeholder="Unit (e.g. g, cups)"
              value={ing.unit}
              onChange={(e) => handleIngredientChange(ing.id, 'unit', e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemoveIngredient(ing.id)}
              className="col-span-2 bg-red-500 text-white rounded-md px-2 py-1"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="mt-2 rounded-md bg-blue-600 text-white px-3 py-1"
        >
          Add Ingredient
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Scaled results</h2>
        {factor === 0 && (
          <p className="text-sm text-red-500">Please enter valid yields.</p>
        )}
        {factor !== 0 && (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-left">Ingredient</th>
                <th className="border-b p-2 text-left">Original</th>
                <th className="border-b p-2 text-left">Scaled</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing) => (
                <tr key={ing.id}>
                  <td className="border-b p-2">{ing.name || '-'}</td>
                  <td className="border-b p-2">
                    {ing.amount} {ing.unit}
                  </td>
                    <td className="border-b p-2">
                    { (ing.amount * factor).toFixed(2) } { ing.unit }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecipeScaleCalculator;