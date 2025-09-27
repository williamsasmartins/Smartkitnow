import React, { useState } from "react";
import { CalculatorLayout } from "../common/CalculatorLayout";

const RecipeScalingCalculator: React.FC = () => {
  const [originalServings, setOriginalServings] = useState<number>(1);
  const [desiredServings, setDesiredServings] = useState<number>(1);
  const [ingredients, setIngredients] = useState<string>("");

  const handleCalculation = () => {
    const lines = ingredients.split("\n");
    const scaled = lines
      .map((line) => {
        const parts = line.split(":");
        if (parts.length !== 2) return line;
        const ingredient = parts[0].trim();
        const amount = parseFloat(parts[1].trim());
        if (isNaN(amount)) return line;
        const scaledAmount = (amount * desiredServings) / originalServings;
        return `${ingredient}: ${scaledAmount}`;
      })
      .join("\n");
    setIngredients(scaled);
  };

  return (
    <CalculatorLayout
      title="Recipe Scaling Calculator"
      description="Scale your recipe ingredients based on desired servings"
      formula="Scaled Amount = (Original Amount * Desired Servings) / Original Servings"
      calculatorName="RecipeScalingCalculator"
      sources={[{ title: "N/A", url: "#" }]}
    >
      <div>
        <label>
          Original Servings:
          <input
            type="number"
            value={originalServings}
            onChange={(e) => setOriginalServings(Number(e.target.value))}
          />
        </label>

        <label>
          Desired Servings:
          <input
            type="number"
            value={desiredServings}
            onChange={(e) => setDesiredServings(Number(e.target.value))}
          />
        </label>

        <label>
          Ingredients (one per line, format: ingredient: amount):
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={10}
          />
        </label>

        <button onClick={handleCalculation}>Scale Recipe</button>
      </div>
    </CalculatorLayout>
  );
};

export default RecipeScalingCalculator;
