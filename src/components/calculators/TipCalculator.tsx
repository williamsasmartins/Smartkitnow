import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState('18');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [result, setResult] = useState<{
    tipAmount: number;
    totalAmount: number;
    amountPerPerson: number;
    tipPerPerson: number;
  } | null>(null);

  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercentage);
    const people = parseInt(numberOfPeople);

    if (bill > 0 && tip >= 0 && people > 0) {
      const tipAmount = (bill * tip) / 100;
      const totalAmount = bill + tipAmount;
      const amountPerPerson = totalAmount / people;
      const tipPerPerson = tipAmount / people;

      setResult({
        tipAmount: Math.round(tipAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        amountPerPerson: Math.round(amountPerPerson * 100) / 100,
        tipPerPerson: Math.round(tipPerPerson * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setBillAmount('');
    setTipPercentage('18');
    setNumberOfPeople('1');
    setResult(null);
  };

  const quickTipButtons = [15, 18, 20, 25];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tip Calculator</CardTitle>
          <CardDescription>
            Calculate tip amounts and split bills among multiple people.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billAmount">Bill Amount ($)</Label>
              <Input
                id="billAmount"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipPercentage">Tip Percentage (%)</Label>
              <Input
                id="tipPercentage"
                type="number"
                step="0.1"
                placeholder="18"
                value={tipPercentage}
                onChange={(e) => setTipPercentage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Number of People</Label>
              <Input
                id="numberOfPeople"
                type="number"
                min="1"
                placeholder="1"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Tip Percentages</Label>
            <div className="flex gap-2">
              {quickTipButtons.map((percentage) => (
                <Button
                  key={percentage}
                  variant={tipPercentage === percentage.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTipPercentage(percentage.toString())}
                >
                  {percentage}%
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={calculateTip} className="flex-1">
              Calculate Tip
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {result && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        ${result.tipAmount.toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Tip Amount</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${result.totalAmount.toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Total Amount</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${result.amountPerPerson.toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Per Person</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        ${result.tipPerPerson.toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Tip Per Person</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};