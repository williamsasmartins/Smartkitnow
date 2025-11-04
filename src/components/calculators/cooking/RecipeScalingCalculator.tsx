import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export const RecipeScalingCalculator = () => {
  const [originalServings, setOriginalServings] = useState('');
  const [desiredServings, setDesiredServings] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: 'cups' }
  ]);
  const [scalingFactor, setScalingFactor] = useState<number | null>(null);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: 'cups' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updated);
  };

  const calculateScaling = () => {
    const original = parseFloat(originalServings);
    const desired = parseFloat(desiredServings);

    if (original > 0 && desired > 0) {
      setScalingFactor(desired / original);
    }
  };

  const handleReset = () => {
    setOriginalServings('');
    setDesiredServings('');
    setIngredients([{ name: '', amount: '', unit: 'cups' }]);
    setScalingFactor(null);
  };

  const getScaledAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num > 0 && scalingFactor !== null) {
      return Math.round(num * scalingFactor * 100) / 100;
    }
    return 0;
  };

  const unitOptions = [
    { value: 'cups', label: 'Cups' },
    { value: 'tbsp', label: 'Tablespoons' },
    { value: 'tsp', label: 'Teaspoons' },
    { value: 'oz', label: 'Ounces' },
    { value: 'lbs', label: 'Pounds' },
    { value: 'g', label: 'Grams' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'ml', label: 'Milliliters' },
    { value: 'l', label: 'Liters' }
  ];

  return (
    <CalculatorLayout
      title="Recipe Scaling Calculator"
      description="Scale recipe ingredients up or down based on the number of servings needed."
      formula="Scaled Amount = Original Amount × (Desired Servings ÷ Original Servings)"
      example="Recipe for 4 people scaled to 6 people: multiply all ingredients by 1.5"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="Original Servings"
            id="originalServings"
            type="number"
            value={originalServings}
            onChange={setOriginalServings}
            placeholder="4"
            required
          />
          <InputGroup
            label="Desired Servings"
            id="desiredServings"
            type="number"
            value={desiredServings}
            onChange={setDesiredServings}
            placeholder="6"
            required
          />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ingredients</CardTitle>
            <Button onClick={addIngredient} variant="calculate" size="sm">
              Add Ingredient
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                <InputGroup
                  label="Ingredient Name"
                  id={`ingredient-name-${index}`}
                  type="text"
                  value={ingredient.name}
                  onChange={(value) => updateIngredient(index, 'name', value)}
                  placeholder="Flour"
                />
                <InputGroup
                  label="Amount"
                  id={`ingredient-amount-${index}`}
                  type="number"
                  value={ingredient.amount}
                  onChange={(value) => updateIngredient(index, 'amount', value)}
                  placeholder="2"
                  step="0.25"
                />
                <InputGroup
                  label="Unit"
                  id={`ingredient-unit-${index}`}
                  type="select"
                  value={ingredient.unit}
                  onChange={(value) => updateIngredient(index, 'unit', value)}
                  options={unitOptions}
                />
                <Button 
                  onClick={() => removeIngredient(index)} 
                  variant="reset" 
                  size="sm"
                  disabled={ingredients.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button variant="calculate" onClick={calculateScaling} className="flex-1">
          Scale Recipe
        </Button>
        <Button variant="reset" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {scalingFactor !== null && (
        <>
          <Separator />
          <ResultCard
            title="Scaling Factor"
            value={Math.round(scalingFactor * 100) / 100}
            suffix="x"
            colorClass="text-primary"
          />

          <Card>
            <CardHeader>
              <CardTitle>Scaled Recipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  ingredient.name && ingredient.amount && (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{ingredient.name}</span>
                      <span>
                        {getScaledAmount(ingredient.amount)} {ingredient.unit}
                        <span className="text-muted-foreground ml-2">
                          (was {ingredient.amount} {ingredient.unit})
                        </span>
                      </span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </CalculatorLayout>
  );
};

export default RecipeScalingCalculator;