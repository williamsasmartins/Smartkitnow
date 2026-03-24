"use client";

import React, { useState } from "react";
import CalculatorLayout from "@/components/layouts/CalculatorLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MarketingROI() {
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState<{ roi: number; profit: number } | null>(null);

  const calculate = () => {
    const r = parseFloat(revenue);
    const c = parseFloat(cost);
    if (!isNaN(r) && !isNaN(c) && c > 0) {
      const profit = r - c;
      const roi = (profit / c) * 100;
      setResult({ roi, profit });
    }
  };

  return (
    <CalculatorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Marketing ROI Calculator</h1>
        <p className="text-muted-foreground mt-2">Calculate the return on investment for your marketing campaigns.</p>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue Generated ($)</Label>
            <Input
              id="revenue"
              type="number"
              placeholder="e.g., 50000"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Marketing Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              placeholder="e.g., 10000"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full">
          Calculate ROI
        </Button>

        {result && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Marketing ROI</div>
                <div className="text-4xl font-bold text-primary">
                  {result.roi.toFixed(2)}%
                </div>
                <div className="text-sm text-balance text-muted-foreground mt-2">
                  Net Profit: ${result.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  );
}
