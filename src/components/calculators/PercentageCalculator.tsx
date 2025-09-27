import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function PercentageCalculator() {
  const [value, setValue] = useState("");
  const [total, setTotal] = useState("");
  const [percentage, setPercentage] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculatePercentage = () => {
    const val = parseFloat(value);
    const tot = parseFloat(total);
    
    if (!isNaN(val) && !isNaN(tot) && tot !== 0) {
      const percent = (val / tot) * 100;
      setResult(`${val} is ${percent.toFixed(2)}% of ${tot}`);
    }
  };

  const calculateValue = () => {
    const percent = parseFloat(percentage);
    const tot = parseFloat(total);
    
    if (!isNaN(percent) && !isNaN(tot)) {
      const val = (percent / 100) * tot;
      setResult(`${percent}% of ${tot} is ${val.toFixed(2)}`);
    }
  };

  const clearAll = () => {
    setValue("");
    setTotal("");
    setPercentage("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Percentage Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate percentages, find what percentage one number is of another, or find a percentage of a number.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What percent is X of Y?</CardTitle>
            <CardDescription>Find what percentage one number is of another</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="value">Value (X)</Label>
              <Input
                id="value"
                type="number"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="total">Total (Y)</Label>
              <Input
                id="total"
                type="number"
                placeholder="Enter total"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
              />
            </div>
            <Button onClick={calculatePercentage} className="w-full">
              Calculate Percentage
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What is X% of Y?</CardTitle>
            <CardDescription>Find a percentage of a number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="percentage">Percentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                placeholder="Enter percentage"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="total2">Total</Label>
              <Input
                id="total2"
                type="number"
                placeholder="Enter total"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
              />
            </div>
            <Button onClick={calculateValue} className="w-full">
              Calculate Value
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary mb-4">{result}</p>
              <Button variant="outline" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Calculate Percentages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">What percent is X of Y?</h3>
            <p className="text-muted-foreground">Formula: (X ÷ Y) × 100 = Percentage</p>
            <p className="text-sm text-muted-foreground">Example: What percent is 25 of 200? (25 ÷ 200) × 100 = 12.5%</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">What is X% of Y?</h3>
            <p className="text-muted-foreground">Formula: (X ÷ 100) × Y = Result</p>
            <p className="text-sm text-muted-foreground">Example: What is 15% of 300? (15 ÷ 100) × 300 = 45</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}