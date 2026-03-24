"use client";

import React, { useState } from "react";
import { CalculatorLayout } from "@/components/calculators/shared/CalculatorLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ROAS() {
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState<{ roasRatio: number; roasPercentage: number } | null>(null);

  const calculate = () => {
    const r = parseFloat(revenue);
    const c = parseFloat(cost);
    
    if (!isNaN(r) && !isNaN(c) && c > 0) {
      const roasRatio = r / c;
      const roasPercentage = (r / c) * 100;
      setResult({ roasRatio, roasPercentage });
    }
  };

  return (
    <CalculatorLayout
      title="Return on Ad Spend (ROAS) Calculator"
      description="Calculate the revenue generated for every dollar spent on advertising."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue from Ad Campaign ($)</Label>
            <Input
              id="revenue"
              type="number"
              placeholder="e.g., 20000"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost of Ad Campaign ($)</Label>
            <Input
              id="cost"
              type="number"
              placeholder="e.g., 5000"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate ROAS
        </Button>

        {result && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Return on Ad Spend</div>
                <div className="text-4xl font-bold text-primary">
                  {result.roasRatio.toFixed(2)}x
                </div>
                <div className="text-sm text-balance text-muted-foreground mt-2">
                  or {result.roasPercentage.toFixed(2)}%
                  <br />
                  (You earn ${result.roasRatio.toFixed(2)} for every $1 spent)
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
