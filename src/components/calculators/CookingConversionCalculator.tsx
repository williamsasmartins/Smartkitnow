import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, ArrowRight } from "lucide-react";

const CookingConversionCalculator = () => {
  const [amount, setAmount] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('tbsp');
  const [toUnit, setToUnit] = useState<string>('fl oz');
  const [ingredient, setIngredient] = useState<string>('water');
  const [result, setResult] = useState<string>('');

  // Conversion factors to milliliters (base unit)
  const volumeConversions = {
    'tsp': 4.92892,
    'tbsp': 14.7868,
    'fl oz': 29.5735,
    'c': 236.588,
    'pt': 473.176,
    'qt': 946.353,
    'gal': 3785.41,
    'ml': 1,
    'l': 1000
  };

  // Weight conversions to grams (base unit)  
  const weightConversions = {
    'mg': 0.001,
    'g': 1,
    'oz': 28.3495,
    'lb': 453.592,
    'kg': 1000
  };

  // Ingredient densities (g/ml)
  const ingredientDensities = {
    'water': 1.0,
    'milk': 1.03,
    'sugar': 0.85,
    'flour': 0.57,
    'butter': 0.91,
    'oil': 0.92,
    'honey': 1.4,
    'salt': 1.2,
    'baking-powder': 0.9,
    'cocoa': 0.41,
    'vanilla': 0.89,
    'other': 1.0
  };

  const units = [
    { value: 'tsp', label: 'Teaspoons (tsp)' },
    { value: 'tbsp', label: 'Tablespoons (tbsp)' },
    { value: 'fl oz', label: 'Fluid Ounces (fl oz)' },
    { value: 'c', label: 'Cups (c)' },
    { value: 'pt', label: 'Pints (pt)' },
    { value: 'qt', label: 'Quarts (qt)' },
    { value: 'gal', label: 'Gallons (gal)' },
    { value: 'ml', label: 'Milliliters (mL)' },
    { value: 'l', label: 'Liters (L)' },
    { value: 'mg', label: 'Milligrams (mg)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'oz', label: 'Ounces (oz)' },
    { value: 'lb', label: 'Pounds (lb)' },
    { value: 'kg', label: 'Kilograms (kg)' }
  ];

  const ingredients = [
    { value: 'water', label: 'Water' },
    { value: 'milk', label: 'Milk' },
    { value: 'sugar', label: 'Sugar' },
    { value: 'flour', label: 'All Purpose Flour' },
    { value: 'butter', label: 'Butter' },
    { value: 'oil', label: 'Cooking Oil' },
    { value: 'honey', label: 'Honey' },
    { value: 'salt', label: 'Salt' },
    { value: 'baking-powder', label: 'Baking Powder' },
    { value: 'cocoa', label: 'Cocoa Powder' },
    { value: 'vanilla', label: 'Vanilla Extract' },
    { value: 'other', label: 'Other' }
  ];

  const isVolumeUnit = (unit: string) => unit in volumeConversions;
  const isWeightUnit = (unit: string) => unit in weightConversions;

  const convertUnits = () => {
    const inputAmount = parseFloat(amount);
    if (!inputAmount || inputAmount <= 0) return;

    const density = ingredientDensities[ingredient as keyof typeof ingredientDensities];
    
    let resultValue = 0;
    
    if (isVolumeUnit(fromUnit) && isVolumeUnit(toUnit)) {
      // Volume to volume conversion
      const mlAmount = inputAmount * volumeConversions[fromUnit as keyof typeof volumeConversions];
      resultValue = mlAmount / volumeConversions[toUnit as keyof typeof volumeConversions];
    } else if (isWeightUnit(fromUnit) && isWeightUnit(toUnit)) {
      // Weight to weight conversion
      const gramAmount = inputAmount * weightConversions[fromUnit as keyof typeof weightConversions];
      resultValue = gramAmount / weightConversions[toUnit as keyof typeof weightConversions];
    } else if (isVolumeUnit(fromUnit) && isWeightUnit(toUnit)) {
      // Volume to weight conversion
      const mlAmount = inputAmount * volumeConversions[fromUnit as keyof typeof volumeConversions];
      const gramAmount = mlAmount * density;
      resultValue = gramAmount / weightConversions[toUnit as keyof typeof weightConversions];
    } else if (isWeightUnit(fromUnit) && isVolumeUnit(toUnit)) {
      // Weight to volume conversion
      const gramAmount = inputAmount * weightConversions[fromUnit as keyof typeof weightConversions];
      const mlAmount = gramAmount / density;
      resultValue = mlAmount / volumeConversions[toUnit as keyof typeof volumeConversions];
    }

    // Format result based on size
    let formattedResult;
    if (resultValue >= 1000) {
      formattedResult = resultValue.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else if (resultValue >= 1) {
      formattedResult = resultValue.toFixed(2).replace(/\.?0+$/, '');
    } else {
      formattedResult = resultValue.toFixed(4).replace(/\.?0+$/, '');
    }

    const fromUnitLabel = units.find(u => u.value === fromUnit)?.label || fromUnit;
    const toUnitLabel = units.find(u => u.value === toUnit)?.label || toUnit;
    
    setResult(`${amount} ${fromUnitLabel} = ${formattedResult} ${toUnitLabel}`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Cooking Conversion Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ingredient">Ingredient</Label>
            <Select value={ingredient} onValueChange={setIngredient}>
              <SelectTrigger id="ingredient" aria-label="Ingredient">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ingredients.map((ing) => (
                  <SelectItem key={ing.value} value={ing.value}>
                    {ing.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromUnit">From Unit</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger id="fromUnit" aria-label="From unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toUnit">To Unit</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger id="toUnit" aria-label="To unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={convertUnits}
              disabled={!amount}
              className="w-full"
            >
              Convert
            </Button>
          </div>

          {result && (
            <Card className="bg-muted/30 border-border/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Result:</h3>
                  <Badge variant="secondary" className="text-lg p-3">
                    {result}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Common Conversions:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>1 cup = 16 tablespoons = 48 teaspoons</li>
              <li>1 tablespoon = 3 teaspoons</li>
              <li>1 cup = 8 fluid ounces</li>
              <li>1 pound = 16 ounces</li>
              <li>1 quart = 4 cups = 32 fluid ounces</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookingConversionCalculator;