import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pizza, Users, ChefHat } from "lucide-react";

const PizzaCalculator = () => {
  const [guests, setGuests] = useState<string>('');
  const [appetite, setAppetite] = useState<string>('normal');
  const [pizzaSize, setPizzaSize] = useState<string>('14');
  const [pizzaType, setPizzaType] = useState<string>('ordering');
  const [result, setResult] = useState<any>(null);

  // Pizza serving calculations
  const servingsPerPizza = {
    '10': { light: 4, normal: 3, hearty: 2 },
    '12': { light: 6, normal: 4, hearty: 3 },
    '14': { light: 8, normal: 6, hearty: 4 },
    '16': { light: 10, normal: 8, hearty: 6 },
    '18': { light: 12, normal: 10, hearty: 8 }
  };

  // Dough recipe ingredients (for one 14" pizza)
  const doughIngredients = {
    flour: 250, // grams
    water: 162.5, // grams (65% hydration)
    salt: 5, // grams (2%)
    yeast: 1.25, // grams (0.5% active dry yeast)
    oil: 12.5 // grams (optional, 5%)
  };

  const calculatePizza = () => {
    const numGuests = parseInt(guests);
    if (!numGuests || numGuests <= 0) return;

    const size = pizzaSize as keyof typeof servingsPerPizza;
    const servings = servingsPerPizza[size][appetite as keyof typeof servingsPerPizza[typeof size]];
    const pizzasNeeded = Math.ceil(numGuests / servings);

    let calculatedResult: any = {
      pizzasNeeded,
      size: pizzaSize,
      servings,
      totalSlices: pizzasNeeded * 8 // assuming 8 slices per pizza
    };

    if (pizzaType === 'making') {
      // Calculate dough ingredients
      const flourPerPizza = doughIngredients.flour * (parseInt(pizzaSize) / 14) ** 2; // Scale by area
      calculatedResult.dough = {
        flour: Math.round(flourPerPizza * pizzasNeeded),
        water: Math.round(doughIngredients.water * (parseInt(pizzaSize) / 14) ** 2 * pizzasNeeded),
        salt: Math.round(doughIngredients.salt * (parseInt(pizzaSize) / 14) ** 2 * pizzasNeeded * 10) / 10,
        yeast: Math.round(doughIngredients.yeast * (parseInt(pizzaSize) / 14) ** 2 * pizzasNeeded * 10) / 10,
        oil: Math.round(doughIngredients.oil * (parseInt(pizzaSize) / 14) ** 2 * pizzasNeeded)
      };
    }

    setResult(calculatedResult);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pizza className="h-5 w-5 text-primary" />
            Pizza Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Guests
              </Label>
              <Input
                id="guests"
                type="number"
                placeholder="Enter number of guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Appetite Level</Label>
              <Select value={appetite} onValueChange={setAppetite}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Appetite</SelectItem>
                  <SelectItem value="normal">Normal Appetite</SelectItem>
                  <SelectItem value="hearty">Hearty Appetite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pizza Size</Label>
              <Select value={pizzaSize} onValueChange={setPizzaSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10" Small</SelectItem>
                  <SelectItem value="12">12" Medium</SelectItem>
                  <SelectItem value="14">14" Large</SelectItem>
                  <SelectItem value="16">16" Extra Large</SelectItem>
                  <SelectItem value="18">18" Family Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pizza Type</Label>
              <Select value={pizzaType} onValueChange={setPizzaType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordering">Ordering Pizza</SelectItem>
                  <SelectItem value="making">Making Pizza Dough</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculatePizza}
            className="w-full"
            disabled={!guests}
          >
            Calculate Pizza Needs
          </Button>

          {result && (
            <div className="space-y-4">
              <Card className="bg-muted/30 border-border/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Pizza Requirements:</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Badge variant="secondary" className="text-lg p-3 w-full">
                          {result.pizzasNeeded} Pizza{result.pizzasNeeded > 1 ? 's' : ''}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {pizzaSize}" pizzas needed
                        </p>
                      </div>
                      
                      <div>
                        <Badge variant="outline" className="text-lg p-3 w-full">
                          {result.totalSlices} Slices
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          Total slices available
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {pizzaType === 'making' && result.dough && (
                <Card className="bg-muted/30 border-border/30">
                  <CardContent className="pt-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <ChefHat className="h-5 w-5" />
                      Pizza Dough Ingredients
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Flour:</span>
                          <span className="font-medium">{result.dough.flour}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Water:</span>
                          <span className="font-medium">{result.dough.water}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Salt:</span>
                          <span className="font-medium">{result.dough.salt}g</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Active Dry Yeast:</span>
                          <span className="font-medium">{result.dough.yeast}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Olive Oil:</span>
                          <span className="font-medium">{result.dough.oil}g</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />
                    
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Basic Instructions:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Dissolve yeast in warm water (105-110°F)</li>
                        <li>Mix flour and salt in a large bowl</li>
                        <li>Add yeast mixture and oil to flour</li>
                        <li>Knead for 8-10 minutes until smooth</li>
                        <li>Let rise in oiled bowl for 1-2 hours</li>
                        <li>Divide and shape into {result.pizzasNeeded} ball{result.pizzasNeeded > 1 ? 's' : ''}</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Serving Guide:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Light Appetite:</strong> 2-3 slices per person</li>
              <li><strong>Normal Appetite:</strong> 3-4 slices per person</li>
              <li><strong>Hearty Appetite:</strong> 4-5 slices per person</li>
              <li>• Consider side dishes and other food when planning</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PizzaCalculator;