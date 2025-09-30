import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const fmt = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 8 }) : "—";

export default function PercentageCalculator() {
  const [value, setValue] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");

  const [result, setResult] = useState<string | null>(null);

  const calculatePercentage = () => {
    const val = parseFloat(value);
    const tot = parseFloat(total);
    if (!Number.isFinite(val) || !Number.isFinite(tot) || tot === 0) {
      setResult("Please enter valid numbers (Total ≠ 0).");
      return;
    }
    const percent = (val / tot) * 100;
    setResult(`${fmt(val)} is ${percent.toFixed(2)}% of ${fmt(tot)}`);
  };

  const calculateValue = () => {
    const pct = parseFloat(percentage);
    const tot = parseFloat(total);
    if (!Number.isFinite(pct) || !Number.isFinite(tot)) {
      setResult("Please enter valid numbers.");
      return;
    }
    const val = (pct / 100) * tot;
    setResult(`${pct}% of ${fmt(tot)} is ${fmt(val)}`);
  };

  const clearAll = () => {
    setValue("");
    setTotal("");
    setPercentage("");
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Percentage Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate percentages, find what percent one number is of another, or find X% of a number.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What percent is X of Y?</CardTitle>
            <CardDescription>Find what percentage one number is of another</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="val">Value (X)</Label>
              <Input
                id="val"
                inputMode="decimal"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="totA">Total (Y)</Label>
              <Input
                id="totA"
                inputMode="decimal"
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
            <div className="grid gap-2">
              <Label htmlFor="pct">Percentage (%)</Label>
              <Input
                id="pct"
                inputMode="decimal"
                placeholder="Enter percentage"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="totB">Total (Y)</Label>
              <Input
                id="totB"
                inputMode="decimal"
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
            <h3 className="font-semibold mb-1">What percent is X of Y?</h3>
            <p className="text-muted-foreground">
              <strong>Formula:</strong> (X ÷ Y) × 100 = Percentage
            </p>
            <p className="text-sm text-muted-foreground">
              Example: What percent is 25 of 200? → (25 ÷ 200) × 100 = <strong>12.5%</strong>
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-1">What is X% of Y?</h3>
            <p className="text-muted-foreground">
              <strong>Formula:</strong> (X ÷ 100) × Y = Result
            </p>
            <p className="text-sm text-muted-foreground">
              Example: What is 15% of 300? → (15 ÷ 100) × 300 = <strong>45</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
