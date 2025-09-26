import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const RecipeScalingCalculator = () => {
  const [originalServings, setOriginalServings] = useState('');
  const [newServings, setNewServings] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState('');
  const [scaledAmount, setScaledAmount] = useState<number | null>(null);

  const calculateScaledAmount = () => {
    const original = parseFloat(originalServings);
    const newServ = parseFloat(newServings);
    const amount = parseFloat(ingredientAmount);
    if (original > 0 && newServ > 0 && amount >= 0) {
      setScaledAmount(amount * (newServ / original));
    }
  };

  const handleReset = () => {
    setOriginalServings('');
    setNewServings('');
    setIngredientAmount('');
    setScaledAmount(null);
  };

  return (
    <CalculatorLayout
      title="Recipe Scaling Calculator"
      description="Scale ingredient amounts for recipes based on original and new number of servings."
      formula="Scaled Amount = Original Amount × (New Servings / Original Servings)"
      example="Original 4 servings, new 6, ingredient 2 cups = 3 cups"
    >
      <div className="space-y-4">
        <InputGroup
          label="Original Servings"
          id="originalServings"
          type="number"
          value={originalServings}
          onChange={(e) => setOriginalServings(e.target.value)}
          placeholder="4"
          required
        />
        <InputGroup
          label="New Servings"
          id="newServings"
          type="number"
          value={newServings}
          onChange={(e) => setNewServings(e.target.value)}
          placeholder="6"
          required
        />
        <InputGroup
          label="Ingredient Amount"
          id="ingredientAmount"
          type="number"
          value={ingredientAmount}
          onChange={(e) => setIngredientAmount(e.target.value)}
          placeholder="2"
          required
        />
        <div className="flex gap-4">
          <Button onClick={calculateScaledAmount} className="flex-1">Calculate</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
        {scaledAmount !== null && (
          <>
            <Separator />
            <ResultCard
              title="Scaled Amount"
              value={scaledAmount.toFixed(2)}
              suffix=""
              colorClass="text-primary"
            />
          </>
        )}
      </div>
    </CalculatorLayout>
  );
};